import { createComponent, ref } from "@vue/composition-api";
import nb from "../components/naiveBayes/NaiveBayes.vue";
import knn from "../components/knn/KNN.vue";

export default createComponent({
    components: {
        nb: nb,
        knn: knn
    },
    setup() {
        const toggle = ref(true);

        function recalcKnn() {
            console.log("app recalc");
            toggle != toggle;
        }
        return { toggle, recalcKnn };
    }
});
