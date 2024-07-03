document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // Define the global constant for calculateBtnDiv
    const calculateBtnDiv = document.getElementById('calculateBtnDiv');
    const myForm = document.getElementById('myForm');
    const mghaResult = document.getElementById('mghaResult');
    const ustonResult = document.getElementById('ustonResult');



    // Initialize tooltips if needed (uncomment if you decide to include Bootstrap JS)
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new bootstrap.Tooltip(tooltipTriggerEl)
    // });

    // main navigation buttons click/switch
    SwitchActiveLink();

    // auto collapse the main collapsible nav button
    AutoCollapseCollapsibleNavBtn();

    //
    OnEspSarSelectChange();

    // events on any input change
    OnAnyInputChange();

    //
    InputClear();

    //
    Calculation();

    OnResetBtnClick();

    OnEquationLinkClick();
});

// main navigation buttons click/switch
function SwitchActiveLink() {
    var header = document.getElementById("navBtns");
    var btns = header.getElementsByClassName("nav-link");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            this.className += " active";
        });
    }

    var sections = {
        "navAbout": "aboutDiv",
        "navEquation": "equationDiv",
        "navCalculator": "calculatorDiv",
        "navContact": "contactDiv"
    };

    for (var key in sections) {
        if (sections.hasOwnProperty(key)) {
            document.getElementById(key).addEventListener("click", function () {
                HandleSectionDisplay(sections, this.id);
            });
        }
    }
}

function HandleSectionDisplay(sections, activeKey) {
    for (var key in sections) {
        if (sections.hasOwnProperty(key)) {
            var section = document.getElementById(sections[key]);
            if (key === activeKey) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        }
    }
}

function OnEquationLinkClick() {
    document.getElementById('equationLink').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default action of the link

        document.getElementById('aboutDiv').style.display = 'none';
        document.getElementById('equationDiv').style.display = 'block';
        const navEquation = document.getElementById('navEquation');
        navEquation.classList.add('active');
        const navAbout = document.getElementById('navAbout');
        navAbout.classList.remove('active');
    });
}

// auto collapse the main collapsible nav button
function AutoCollapseCollapsibleNavBtn() {
    var navLinks = document.querySelectorAll('.nav-link');
    var navCollapse = document.getElementById('collapsibleNavbar');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var bsCollapse = new bootstrap.Collapse(navCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });
}


function OnEspSarSelectChange() {
    document.querySelectorAll("input[name='optradio']").forEach(function (radio) {
        radio.addEventListener("change", function () {

            if (calculateBtnDiv.style.display === 'none') {
                mghaResult.value = '';
                ustonResult.value = '';
                calculateBtnDiv.style.display = 'block';
            }

            const initialESP = document.getElementById("initialESP");
            const targetESP = document.getElementById("targetESP");
            const initialSAR = document.getElementById("initialSAR");
            const targetSAR = document.getElementById("targetSAR");
            const espInputDiv = document.getElementById("espInputDiv");
            const sarInputDiv = document.getElementById("sarInputDiv");


            if (document.querySelector("input[name='optradio']:checked").value === 'esp') {
                espInputDiv.style.display = 'block';
                sarInputDiv.style.display = 'none';

                initialSAR.required = false;
                targetSAR.required = false;
                initialESP.required = true;
                targetESP.required = true;
            } else {
                espInputDiv.style.display = 'none';
                sarInputDiv.style.display = 'block';

                initialSAR.required = true;
                targetSAR.required = true;
                initialESP.required = false;
                targetESP.required = false;
            }
        });
    });
}


// calculate the factor constant value based on target or final ESP or SAR value
function GetFactorValue(targetValue) {
    var f;
    if (targetValue >= 15)
        f = 1.1;
    else if (targetValue <= 5)
        f = 1.3;
    else
        f = 1.4 - 0.02 * targetValue;
    return f;
}


function GypsumRequirement(factor, depth, density, cec, initialValue, targetValue, purity) {
    return 0.86 * factor * depth * density * cec * (initialValue - targetValue) / purity;
}


function Calculation() {
    myForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        var formData = new FormData(myForm);
        var initialValue;
        var targetValue;

        if (document.querySelector("input[name='optradio']:checked").value === 'esp') {
            initialValue = Number(formData.get('initialESP'));
            targetValue = Number(formData.get('targetESP'));
        }
        else {
            initialValue = Number(formData.get('initialSAR'));
            targetValue = Number(formData.get('targetSAR'));
        }

        if (targetValue >= initialValue) {
            alert('Target value must be smaller than Initial value.');
            event.preventDefault();
        }
        else {
            calculateBtnDiv.style.display = 'none';

            var depth = Number(formData.get('depth'));
            var density = Number(formData.get('density'));
            var cec = Number(formData.get('cec'));
            var purity = Number(formData.get('purity'));

            var f = GetFactorValue(targetValue);
            var result1 = GypsumRequirement(f, depth, density, cec, initialValue, targetValue, purity);
            var result2 = result1 * 0.44609;

            mghaResult.value = result1.toFixed(1) + '    Mg/Ha';
            ustonResult.value = result2.toFixed(1) + '    US Ton/Acre';

            const resultDiv = document.getElementById('resultDiv');
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }

    });
}


function clearInput(buttonId, inputId) {
    document.getElementById(buttonId).addEventListener('click', function () {
        document.getElementById(inputId).value = '';
    });
}

function InputClear() {
    clearInput('clearDepthButton', 'depth');
    clearInput('clearDensityButton', 'density');
    clearInput('clearCecButton', 'cec');
    clearInput('clearPurityButton', 'purity');
    clearInput('clearInitialESPButton', 'initialESP');
    clearInput('clearTargetESPButton', 'targetESP');
    clearInput('clearInitialSARButton', 'initialSAR');
    clearInput('clearTargetSARButton', 'targetSAR');
}


// todo: any numeric input change should result in the display of the resultDiv to none if it was previously displayed

function OnAnyInputChange() {
    document.querySelectorAll('input[type="number"]').forEach(function (input) {
        input.addEventListener('input', function () {
            mghaResult.value = '';
            ustonResult.value = '';
            calculateBtnDiv.style.display = 'block';
        });
    });
}

// event listener for the 'resetBtn' click event
function OnResetBtnClick() {
    document.getElementById('resetBtn').addEventListener('click', function () {
        myForm.reset();
        calculateBtnDiv.style.display = 'block';
        window.scrollTo(0, 0);  // Scroll to the top of the page
    });
}
