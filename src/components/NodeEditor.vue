<template>
  <div ref="editor" :style="{height: height, width: width}"></div>
</template>

<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";

export default {
  name: "NodeEditor",
  props: {
    factors: Array,
    activities: Array,
    impacts: Array,
  },
  watch: {
    factors(fs) {
      fs.forEach((f, index) => {

      });
    },
  },
  data() {
    return {
      width: `${window.innerWidth * 0.9}px`,
      height: "1000px", // `${window.innerHeight * 0.7}px`,
    };
  },
  async mounted() {

    const numSocket = new Rete.Socket("relation");

    class FactorComponent extends Rete.Component {
      constructor() {
        super("Factor");
      }

      /**
       * @param node
       * @returns {Promise<void>}
       */
      builder(node) {
        return new Promise(resolve => {
          node.addOutput(new Rete.Output("affect", "Affects", numSocket));
          resolve();
        });
      }

      worker(node, inputs, outputs, ...args) {
        outputs.num = node.data.num;
      }
    }

    class ActivityComponent extends Rete.Component {
      constructor() {
        super("Activity");
      }

      builder(node) {
        node.addInput(new Rete.Input("pos", "Positive", numSocket, true));
        node.addInput(new Rete.Input("neg", "Negative", numSocket, true));
        node.addInput(new Rete.Input("ind", "Indifferent", numSocket, true));
      }

      worker(node, inputs, outputs) {
        outputs.num = node.data.num;
      }
    }

    this.editor = new Rete.NodeEditor("demo@0.1.0", this.$refs.editor);

    this.editor.use(ConnectionPlugin);
    this.editor.use(VueRenderPlugin);

    const numComponent = new FactorComponent();
    const activityComponent = new ActivityComponent();
    this.editor.register(numComponent);
    this.editor.register(activityComponent);

    const engine = new Rete.Engine("demo@0.1.0");
    engine.register(numComponent);

    for (let i = 0; i < 5; i++) {
      const node = await numComponent.createNode({id: i});
      node.id = i;
      node.position = [10, 110 * i + 10];
      this.editor.addNode(node);

      const node2 = await activityComponent.createNode({id: i + 10});
      node2.id = i + 10;
      node2.position = [250, 170 * i + 10];
      this.editor.addNode(node2);

      this.editor.connect(node.outputs.get("affect"), node2.inputs.get("pos"));
    }

    this.editor.on("zoom", () => {
      return false;
    });

    this.editor.on("process nodecreated noderemoved connectioncreated connectionremoved", () => {
      return false;
    });
  },
};
</script>

<style>
.factor {
  background: #42b983 !important;
  border: none !important;
}

.activity {
  background: darkcyan !important;
  border: none !important;
}

.activity .input:nth-child(2) .relation {
  background: #9BC53D !important;
}

.activity .input:nth-child(3) .relation {
  background: darkred !important;
}

.activity .input:nth-child(4) .relation {
  background: lightgray !important;
}
</style>