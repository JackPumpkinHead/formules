function addition() {
    const A = 118.4;
    const A_optimize_first = 118.172911872655;
    const A_optimize_second = 118.4;
    const V = 12;
    const na = 1.336;
    const nc = 1.333;
    const ncml = 0.333;

    let PWM = Number(document.getElementById("PWM").value);
    
    let PSM = Number(document.getElementById("PSM").value);
    
    let L = Number(document.getElementById("L").value);

    let depth_front_camera = Number(document.getElementById("depth_front_camera").value);

    let IOL = Number(document.getElementById("IOL").value);

    let A_not_optimize = Number(document.getElementById("A_not_optimize").value);

    let spherical = Number(document.getElementById("spherical").value);

    let cylindrical = Number(document.getElementById("cylindrical").value);

    let K = (PWM + PSM) / 2;

    let r = 337.5 / K;

    let Lcor = checkLcor(L);

    let Cw = -5.41 + 0.58412 * Lcor + 0.098 * K;

    let H = calcH(r, Cw);

    let RETHICK = 0.65696 - 0.02029 * L;

    let LOPT = L + RETHICK;

    let after_operation = spherical + (1/2 * cylindrical);

    let A_optimize = optimize(after_operation, V, r, ncml, IOL, na, LOPT);
    // var A_optimize = 118.172911872655
    
    let ACDconst = 0.62467 * A_optimize - 68.747;

    let Offset = ACDconst - 3.336;

    let ACDest = H + Offset;

    let REFX = (1000 * na * (na * r - ncml * LOPT) - IOL * (LOPT - ACDest) * (na * r - ncml * ACDest)) /
        (na * (V * (na * r - ncml * LOPT) + LOPT * r) - 0.001 * IOL * (LOPT - ACDest) * (V * (na * r - ncml * ACDest) + ACDest * r));


    // Начал считать оптимизированную А-константу, но в итоге значение REFX не совпадает с after_operation,
    // и оптимизированная константа получает значение в 1176 в первом тесте и ~1000 во втором


    document.getElementById("K").value = K.toFixed(2);

    document.getElementById("r").value = r.toFixed(8);

    document.getElementById("Lcor").value = Lcor.toFixed(8);

    document.getElementById("Cw").value = Cw.toFixed(13);

    document.getElementById("H").value = H.toFixed(8);    

    document.getElementById("ACDconst").value = ACDconst.toFixed(8);

    document.getElementById("Offset").value = Offset.toFixed(8);

    document.getElementById("ACDest").value = ACDest.toFixed(8);

    document.getElementById("RETHICK").value = RETHICK.toFixed(8);

    document.getElementById("LOPT").value = LOPT;

    document.getElementById("A_optimize").value = A_optimize;

    document.getElementById("after_operation").value = after_operation;

    // document.getElementById("IOLemme_first").value = IOLemme_first.toFixed(1);
    // document.getElementById("IOLemme_second").value = IOLemme_second.toFixed(1);

    document.getElementById("REFX").value = REFX.toFixed(3);



}

function checkLcor(L) {
    let Lcor;
    if (L <= 24.4){
        Lcor = L;
    } else {
        Lcor = -3.446 + 1.716 * L - 0.0237 * Math.pow(L, 2);
    }
    return Lcor;
}

function calcH(r, Cw) {
    return r - Math.sqrt(r * r - ((Cw * Cw)/4));
}

function optimize (after_operation, V, r, ncml, IOL, na, LOPT) {
    let FEFX = after_operation;
    let a = - FEFX * ( r - V * ncml) - IOL * ncml;
    let b = FEFX * (0.001 * IOL * V * na * r - 0.001 * LOPT * (r - V * ncml)) + IOL * LOPT * ncml + IOL * na * r;

    let c = FEFX * (Math.pow(na, 2) * V * r - na * V * ncml * LOPT + na * LOPT * r - 0.001 * IOL * LOPT * V * na * r) -
        1000 * Math.pow(na, 2) * r + 1000 * na * ncml * LOPT + IOL * LOPT * na * r;

    return descriminant(a, b, c)

}

function descriminant(a, b, c,) {
    let D = (Math.pow(b, 2)) - (4 * a * c);

    let x1 = (-b + Math.sqrt(D)) / (2 * a);

    let x2 = (-b - Math.sqrt(D)) / (2 * a);

    console.log(x1, x2)
    if (x1 >= 0) return x1;
    else return x2;


}




