import { createComponent, toRefs } from "@vue/composition-api";
import irisData from "../csvjson";
import _ from "lodash";
import { shuffle } from "@/api";
type Classes = "Iris-setosa" | "Iris-versicolor" | "Iris-virginica";

interface IIrisData {
    f1: number;
    f2: number;
    f3: number;
    f4: number;
    type: Classes;
}

type IClasses = {
    [key in Classes]: number;
};

type IFreq = {
    [key in Classes]: {
        [key in string]: number;
    };
};

const trainingPart = 0.55;

export default createComponent({
    setup() {
        const testData: IIrisData[] = shuffle(irisData).slice(0, irisData.length * trainingPart);
        const prodData: IIrisData[] = shuffle(irisData).slice(irisData.length * trainingPart);
        const { types, freq } = train(testData);

        const prodResult = [
            {
                data: {},
                result: true
            }
        ];

        prodData.forEach((el: IIrisData) => {
            prodResult.push(classify(types, freq, el));
        });

        const chartpie = [{ data: [prodResult.filter(el => el.result).length, 2], backgroundColor: ["green", "red"] }];

        return {
            prodResult,
            prodData,
            chartpie
        };
    }
});

function train(data: IIrisData[]) {
    const types: IClasses = {
        "Iris-setosa": 0,
        "Iris-versicolor": 0,
        "Iris-virginica": 0
    };

    var freq: IFreq = {
        "Iris-setosa": {},
        "Iris-versicolor": {},
        "Iris-virginica": {}
    };

    for (let i = 0; i < data.length; i++) {
        const { f1, f2, f3, f4, type } = data[i];

        types[type]++; // count classes frequencies

        const a = [f1, f2, f3, f4];
        for (let m in a) {
            freq[type][a[m]] ? freq[type][a[m]]++ : (freq[type][a[m]] = 1); // count features frequencies
        }
    }
    let t: Classes;

    for (t in freq) {
        for (let m in freq[t]) {
            freq[t][m] /= types[t];
        }
    }

    for (t in types) {
        types[t] /= data.length; // # normalize classes frequencies
    }

    // console.log(freq);

    return { types, freq }; // P(O|C) - freq, P(C) - types
}

function classify(types: IClasses, freq: IFreq, data: IIrisData) {
    let t: Classes;
    const result = [];
    for (t in types) {
        // P(C) * P(O1|C) * P(O2|C) ... P(On|C);
        const r = types[t] * freq[t][data.f1] * freq[t][data.f2] * freq[t][data.f3] * freq[t][data.f4];
        result.push({ type: t, value: r });
    }

    const res = _.maxBy(result, (el: any) => el.value);
    // console.log(res);
    if (res && res.type && res.type == data.type) {
        // console.log("Success");
        return { data, result: true };
    } else {
        // console.log("error");
        return { data, result: false };
    }
}
