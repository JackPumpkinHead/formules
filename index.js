function addition() {
    const A = 118.4;
    const A_optimize_first = 118.172911872655;
    const A_optimize_second = 118.4;
    const V = 12;
    const na = 1.336;
    const nc = 1.333;
    const ncml = 0.333;

    var PWM = Number(document.getElementById("PWM").value);
    
    var PSM = Number(document.getElementById("PSM").value);
    
    var L = Number(document.getElementById("L").value);

    var depth_front_camera = Number(document.getElementById("depth_front_camera").value);

    var IOL = Number(document.getElementById("IOL").value);

    var A_not_optimize = Number(document.getElementById("A_not_optimize").value);

    var spherical = Number(document.getElementById("spherical").value);

    var cylindrical = Number(document.getElementById("cylindrical").value);

    var K = (PWM + PSM) / 2;

    var r = 337.5 / K;

    var Lcor = checkLcor(L);

    var Cw = -5.41 + 0.58412 * Lcor + 0.098 * K;

    var H = calcH(r, Cw);

    var RETHICK = 0.65696 - 0.02029 * L;

    var LOPT = L + RETHICK;

    var after_operation = spherical + (1/2 * cylindrical);

    var A_optimize = optimize(after_operation, V, r, ncml, IOL, na, LOPT)
    
    var ACDconst = 0.62467 * A_optimize - 68.747;

    var Offset = ACDconst - 3.336;

    var ACDest = H + Offset;

    var REFX = (1000 * na * (na * r - ncml * LOPT) - IOL * (LOPT - ACDest) * (na * r - ncml * ACDest)) / 
        (na * (V * (na * r - ncml * LOPT) + LOPT * r) - 0.001 * IOL * (LOPT - ACDest) * (V * (na * r - ncml * ACDest) + ACDest * r));





    document.getElementById("K").value = K.toFixed(2);

    document.getElementById("r").value = r.toFixed(8);

    document.getElementById("Lcor").value = Lcor.toFixed(8);

    document.getElementById("Cw").value = Cw.toFixed(8);    

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

    document.getElementById("REFX").value = REFX.toFixed(2);



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

    let c = FEFX * (na * na * V * r - na * V * ncml * LOPT + na * LOPT * r - 0.001 * IOL * LOPT * V * na * r) -
        1000 * na * na * r + 1000 * na * ncml * LOPT + IOL * LOPT * na * r;

    return descriminant(a, b, c)

}

function descriminant(a, b, c,) {
    var D = b * b - 4 * a * c;

    var x1 = (-b + Math.sqrt(D)) / 2 * a;

    var x2 = (-b - Math.sqrt(D)) / 2 * a;



    if (x1 >= 0) return x1;
    else return x2;

}




