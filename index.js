function addition() {
    const A = 118.4;
    const A_optimize_first = 118.172911872655;
    const A_optimize_second = 118.4;
    const V = 12;
    const na = 1.336;
    const nc = 1.333;
    const ncml = 0.333;

    var PWM_first = Number(document.getElementById("PWM_first").value);
    var PWM_second = Number(document.getElementById("PWM_second").value);
    
    var PSM_first = Number(document.getElementById("PSM_first").value);
    var PSM_second = Number(document.getElementById("PSM_second").value);
    
    var L_first = Number(document.getElementById("L_first").value);
    var L_second = Number(document.getElementById("L_second").value);

    var depth_front_camera_first = Number(document.getElementById("depth_front_camera_first").value);
    var depth_front_camera_second = Number(document.getElementById("depth_front_camera_second").value);

    var A_not_optimize_first = Number(document.getElementById("A_not_optimize_first").value);
    var A_not_optimize_second = Number(document.getElementById("A_not_optimize_second").value);

    var IOL_first = Number(document.getElementById("IOL_first").value);
    var IOL_second = Number(document.getElementById("IOL_second").value);

    var K_first = (PWM_first + PSM_first) / 2;
    var K_second = (PWM_second + PSM_second) / 2;

    var r_first = 337.5 / K_first;
    var r_second = 337.5 / K_second;

    var Lcor_first = checkLcor(L_first);
    var Lcor_second = checkLcor(L_second);

    var Cw_first = -5.41 + 0.58412 * Lcor_first + 0.098 * K_first;
    var Cw_second = -5.41 + 0.58412 * Lcor_second + 0.098 * K_second;

    var H_first = calcH(r_first, Cw_first);
    var H_second = calcH(r_second, Cw_second);

    // var A_optimize_first = -IOL_first - 2.5 * L_first - 0.9 * K_first;
    // var A_optimize_second = -IOL_second - 2.5 * L_second - 0.9 * K_second;

    
    var ACDconst_first = 0.62467 * A_optimize_first - 68.747;
    var ACDconst_second = 0.62467 * A_optimize_second - 68.747;

    var Offset_first = ACDconst_first - 3.336;
    var Offset_second = ACDconst_second - 3.336;

    var ACDest_first = H_first + Offset_first;
    var ACDest_second = H_second + Offset_second;

    var RETHICK_first = 0.65696 - 0.02029 * L_first;
    var RETHICK_second = 0.65696 - 0.02029 * L_second;

    var LOPT_first = L_first + RETHICK_first;
    var LOPT_second = L_second + RETHICK_second;

    var IOLemme_first = (1000 * na * (na * r_first - ncml * LOPT_first)) / ((LOPT_first - ACDest_first) * (na * r_first - ncml * ACDest_first));
    var IOLemme_second = (1000 * na * (na * r_second - ncml * LOPT_second)) / ((LOPT_second - ACDest_second) * (na * r_second - ncml * ACDest_second));

    var REFX_first = (1000 * na * (na * r_first - ncml * LOPT_first) - IOL_first * (LOPT_first - ACDest_first) * (na * r_first - ncml * ACDest_first)) / 
        (na * (V * (na * r_first - ncml * LOPT_first) + LOPT_first * r_first) - 0.001 * IOL_first * (LOPT_first - ACDest_first) * (V * (na * r_first - ncml * ACDest_first) + ACDest_first * r_first));
    
    var REFX_second = (1000 * na * (na * r_second - ncml * LOPT_second) - IOL_second * (LOPT_second - ACDest_second) * (na * r_second - ncml * ACDest_second)) / 
        (na * (V * (na * r_second - ncml * LOPT_second) + LOPT_second * r_second) - 0.001 * IOL_second * (LOPT_second - ACDest_second) * (V * (na * r_second - ncml * ACDest_second) + ACDest_second * r_second));
    
    
    document.getElementById("K_first").value = K_first.toFixed(2);
    document.getElementById("K_second").value = K_second.toFixed(2);

    document.getElementById("r_first").value = r_first.toFixed(8);
    document.getElementById("r_second").value = r_second.toFixed(8);

    document.getElementById("Lcor_first").value = Lcor_first.toFixed(8);
    document.getElementById("Lcor_second").value = Lcor_second.toFixed(8);

    document.getElementById("Cw_first").value = Cw_first.toFixed(8);
    document.getElementById("Cw_second").value = Cw_second.toFixed(8);    

    document.getElementById("H_first").value = H_first.toFixed(8);
    document.getElementById("H_second").value = H_second.toFixed(8);    

    document.getElementById("ACDconst_first").value = ACDconst_first.toFixed(8);
    document.getElementById("ACDconst_second").value = ACDconst_second.toFixed(8);

    document.getElementById("Offset_first").value = Offset_first.toFixed(8);
    document.getElementById("Offset_second").value = Offset_second.toFixed(8);

    document.getElementById("ACDest_first").value = ACDest_first.toFixed(8);
    document.getElementById("ACDest_second").value = ACDest_second.toFixed(8);

    document.getElementById("RETHICK_first").value = RETHICK_first.toFixed(8);
    document.getElementById("RETHICK_second").value = RETHICK_second.toFixed(8);

    document.getElementById("LOPT_first").value = LOPT_first;
    document.getElementById("LOPT_second").value = LOPT_second;

    document.getElementById("A_optimize_first").value = A_optimize_first
    document.getElementById("A_optimize_second").value = A_optimize_second;

    // document.getElementById("IOLemme_first").value = IOLemme_first.toFixed(1);
    // document.getElementById("IOLemme_second").value = IOLemme_second.toFixed(1);

    document.getElementById("REFX_first").value = REFX_first.toFixed(2);
    document.getElementById("REFX_second").value = REFX_second.toFixed(2);

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


