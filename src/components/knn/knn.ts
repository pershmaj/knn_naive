import { createComponent, computed, ref, toRefs, reactive } from "@vue/composition-api";
import irisData from "../csvjson";
import _ from "lodash";
import { shuffle } from "@/api";
type Classes = "Iris-setosa" | "Iris-versicolor" | "Iris-virginica";

const trainPart = 0.75;

interface IFeature {
    f1: number;
    f2: number;
    f3: number;
    f4: number;
}

interface IData extends IFeature {
    type: Classes;
}

export default createComponent({
    setup(props, ctx) {
        const fields = [
            { key: "value", label: "Result" },
            { key: "calc.result[0][0]", label: "Predicted class" },
            { key: "el.type", label: "Original class" },
            { key: "calc.first.distance", label: "Distance" }
        ];

        const { neib, testData } = makeSets(irisData, trainPart);

        const s = reactive({
            knn: computed(() => knn(s.testData, s.neib)),
            neib: neib,
            testData: testData
        });

        function recalc() {
            console.log("recalc");
            ctx.root.$emit("recalcKnn");
        }
        function rowClass(item: any) {
            if (!item) return;
            if (item.value) return "table-success";
            else return "table-danger";
        }

        return {
            fields,
            ...toRefs(s.knn),
            recalc,
            rowClass
        };
    }
});

function makeSets(irisData: IData[], pers: number) {
    const a = shuffle(irisData);
    return { neib: a.slice(0, a.length * pers), testData: a.slice(a.length * pers) };
}

function knn(testData: IData[], neib: IData[]) {
    console.log("calculating...");
    const knn = new KNN(3);
    const result: any[] = [];
    testData.forEach((el: IData) => {
        let goal = knn.getGoal(neib, el);

        result.push({ value: el.type === goal.result[0][0], calc: goal, el: el });
    });

    // console.log(result[0].value);
    const accuracy = computed(
        () =>
            result.filter(el => {
                return el.value;
            }).length / result.length
    );

    return { result, accuracy, neib, testData };
}

class KNN {
    k: number;
    constructor(k: number) {
        this.k = k;
    }
    getGoal(features: IData[], data: IData) {
        const a: any = [];
        features.forEach((el: IData) => {
            const type = el.type;
            var distance = 0;
            let feat: keyof IData;
            for (feat in el) {
                if (feat == "type") continue;
                distance += this.distance(el[feat], data[feat]);
            }
            a.push({ type: type, distance: Math.sqrt(distance) });
        });
        const sortedA = _.orderBy(a, ["distance"], ["asc"]);
        console.log(sortedA);
        const result = _(sortedA)
            .take(3)
            .countBy("type")
            .toPairs()
            .value();

        console.log(result);

        return { result };
    }
    distance(pointA: number, pointB: number) {
        return (pointA - pointB) ** 2;
    }
}
