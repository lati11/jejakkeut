let presetRecipes = {};
let nameMap = {};

const materialsListEl = document.getElementById('materials-list');
const addMaterialBtn = document.getElementById('add-material');
const outcomesListEl = document.getElementById('outcomes-list');
const addOutcomeBtn = document.getElementById('add-outcome');
const staminaAmountEl = document.getElementById('stamina-amount');
const staminaUnitCountEl = document.getElementById('stamina-unit-count');
const staminaUnitPriceEl = document.getElementById('stamina-unit-price');
const resultCostEl = document.getElementById('result-cost');
const itemNameInput = document.getElementById('item-name');
const presetDropdown = document.getElementById('preset-dropdown');
const mainIcon = document.getElementById('main-item-icon');

function getIconPath(koreanName) {
    const englishName = nameMap[koreanName];
    if (englishName) {
        return `/images/${englishName}.png`;
    }
    return "";
}

function addMaterialRow(defaultName = '', defaultAmount = '') {
    const wrapper = document.createElement('div');
    wrapper.className = "material-row flex items-center gap-2";
    const iconPath = getIconPath(defaultName);
    wrapper.innerHTML = `
        <div class="flex-grow flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-2 border rounded-md bg-gray-50">
            
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div class="relative w-60">
                    <img src="${iconPath}" alt=""
                        class="material-icon absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5" 
                        style="display: ${iconPath ? 'block' : 'none'}" 
                        onerror="this.style.display='none'">
                    
                    <input type="text" placeholder="재료 이름" value="${defaultName}"
                        data-type="material-name-input"
                        class="pl-9 py-1 px-2 border border-gray-300 rounded-md w-full"
                        autocomplete="off">

                    <div data-type="material-dropdown" 
                         class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 hidden max-h-40 overflow-y-auto">
                    </div>
                </div>
            
                <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">x</label>
                    <input type="number" data-type="required" placeholder="개수" value="${defaultAmount}"
                           class="w-12 py-1 px-2 border border-gray-300 rounded-md text-right">
                </div>
            </div>

            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">시세</label>
                
                <div class="relative flex items-center gap-1 py-0.2 px-2 border border-gray-200 rounded-md bg-white">
                    
                    <div data-type="stack-buttons" class="absolute absolute -bottom-5 left-0 flex gap-1 hidden">
                        <button type="button" data-value="16" class="stack-btn py-0 px-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">16</button>
                        <button type="button" data-value="32" class="stack-btn py-0 px-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">32</button>
                        <button type="button" data-value="64" class="stack-btn py-0 px-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">64</button>
                    </div>

                    <input type="number" data-type="unit-count" value="1" 
                           class="w-12 py-1 px-2 border-none rounded-md text-right focus:ring-0 focus:border-none">
                    <span class="text-sm text-gray-500 whitespace-nowrap">개당</span>
                    <input type="number" data-type="unit-price"
                           class="w-28 py-1 px-2 border-none rounded-md text-right focus:ring-0 focus:border-none">
                    <span class="text-sm text-gray-500 whitespace-nowrap">코인</span>
                </div>
            </div>

        </div>
        <button class="remove-btn inline-block transform rotate-45 text-black text-2xl font-light p-1 rounded-md flex-shrink-0">+</button>
    `;
    materialsListEl.appendChild(wrapper);
}

function addOutcomeRow(defaultAmount = '') {
    const wrapper = document.createElement('div');
    wrapper.className = "outcome-row flex items-center gap-2";
    wrapper.innerHTML = `
        <div class="flex-grow flex flex-wrap items-center justify-center gap-x-64 gap-y-2 p-2 border rounded-md bg-gray-50">
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">제작 개수</label>
                <input type="number" data-type="outcome-amount" value="${defaultAmount}"
                       class="w-16 py-1 px-2 border border-gray-300 rounded-md text-right">
            </div>
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">확률</label>
                <input type="number" data-type="outcome-prob"
                       class="w-16 py-1 px-2 border border-gray-300 rounded-md text-right">
                <span class="text-sm text-gray-500 whitespace-nowrap">%</span>
            </div>
        </div>
        <button class="remove-btn inline-block transform rotate-45 text-black text-2xl font-light p-1 rounded-md flex-shrink-0">+</button>
    `;
    outcomesListEl.appendChild(wrapper);
}

function removeRow(e) {
    if (e.target.classList.contains('remove-btn')) {
        e.target.closest('.material-row, .outcome-row').remove();
        calculateExpectedCost();
    }
}


function showDropdown() { 
    const filter = itemNameInput.value.toUpperCase();
    presetDropdown.innerHTML = '';
    
    const filteredKeys = Object.keys(presetRecipes).filter(key => 
        key.toUpperCase().includes(filter)
    );

    if (filteredKeys.length === 0) {
        presetDropdown.classList.add('hidden');
        return;
    }

    filteredKeys.forEach(key => {
        const item = document.createElement('div');
        const iconPath = getIconPath(key);
        item.innerHTML = `
            <img src="${iconPath}" alt="" class="w-5 h-5 mr-2 inline-block" onerror="this.style.display='none'">
            <span>${key}</span> 
        `;
        item.className = 'flex items-center p-2 hover:bg-gray-100 cursor-pointer';
        
        item.addEventListener('mousedown', () => { 
            itemNameInput.value = key;
            presetDropdown.classList.add('hidden');
            applyRecipe(key);
        });
        presetDropdown.appendChild(item);
    });
    presetDropdown.classList.remove('hidden');
}

function showMaterialDropdown(inputElement) { 
    const dropdown = inputElement.nextElementSibling;
    if (!dropdown || dropdown.dataset.type !== 'material-dropdown') return;

    const filterValue = inputElement.value;
    if (!filterValue || filterValue.trim() === '') {
        dropdown.classList.add('hidden');
        return;
    }

    const filter = inputElement.value;
    dropdown.innerHTML = '';
    
    const filteredKeys = Object.keys(nameMap).filter(key => 
        key.toUpperCase().includes(filter)
    );

    if (filteredKeys.length === 0) {
        dropdown.classList.add('hidden');
        return;
    }

    filteredKeys.forEach(key => {
        const item = document.createElement('div');
        const iconPath = getIconPath(key);
        item.innerHTML = `
            <img src="${iconPath}" alt="" class="w-5 h-5 mr-2 inline-block" onerror="this.style.display='none'">
            <span>${key}</span>
        `;
        item.className = 'flex items-center p-2 hover:bg-gray-100 cursor-pointer';
        
        item.addEventListener('mousedown', () => { 
            const container = inputElement.closest('.relative');
            const iconImg = container.querySelector('.material-icon');
            
            inputElement.value = key; 
            iconImg.src = iconPath; 
            iconImg.style.display = iconPath ? 'block' : 'none'; 
            
            dropdown.classList.add('hidden');
            calculateExpectedCost(); 
        });
        dropdown.appendChild(item);
    });
    dropdown.classList.remove('hidden');
}


function applyRecipe(recipeKey) {
    const recipe = presetRecipes[recipeKey];
    if (!recipe) return;
    const mainIconPath = getIconPath(recipeKey);
    mainIcon.src = mainIconPath;
    mainIcon.style.display = mainIconPath ? 'block' : 'none';

    staminaAmountEl.value = recipe.stamina;

    materialsListEl.innerHTML = '';
    outcomesListEl.innerHTML = '';

    recipe.materials.forEach(mat => {
        addMaterialRow(mat.name, mat.amount);
    });


    recipe.outcomes.forEach(out => {
        addOutcomeRow(out.amount);
    });
    
    calculateExpectedCost();
}

function calculateExpectedCost() {
    let totalCost = 0;

    const staminaValue = Number(staminaAmountEl.value) || 0;
    const staminaUnitCount = Number(staminaUnitCountEl.value) || 1;
    const staminaUnitPrice = Number(staminaUnitPriceEl.value) || 0;
    const staminaCostPerUnit = staminaUnitPrice / staminaUnitCount;
    totalCost += staminaValue * staminaCostPerUnit;

    const materialRows = materialsListEl.querySelectorAll('.material-row');
    materialRows.forEach(row => {
        const requiredAmount = Number(row.querySelector('[data-type="required"]').value) || 0;
        const unitCount = Number(row.querySelector('[data-type="unit-count"]').value) || 1;
        const unitPrice = Number(row.querySelector('[data-type="unit-price"]').value) || 0;

        const pricePerItem = unitPrice / unitCount;
        totalCost += pricePerItem * requiredAmount;
    });

    let expectedAmount = 0;
    const outcomeRows = outcomesListEl.querySelectorAll('.outcome-row');
    outcomeRows.forEach(row => {
        const amount = Number(row.querySelector('[data-type="outcome-amount"]').value) || 0;
        const probability = Number(row.querySelector('[data-type="outcome-prob"]').value) || 0;

        expectedAmount += amount * (probability / 100);
    });

    let costPerItem = 0;
    if (expectedAmount > 0) {
        costPerItem = totalCost / expectedAmount;
    }
    
    if (costPerItem === 0 || !isFinite(costPerItem)) {
        resultCostEl.textContent = "0";
    } else {
        resultCostEl.textContent = costPerItem.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
}

function onUnitCountFocus(e) {
    if (e.target.dataset.type === 'unit-count') {
        const stackButtons = e.target.parentElement.querySelector('[data-type="stack-buttons"]');
        if (stackButtons) {
            stackButtons.classList.remove('hidden');
        }
    }
}

function onUnitCountBlur(e) {
    if (e.target.dataset.type === 'unit-count') {
        const stackButtons = e.target.parentElement.querySelector('[data-type="stack-buttons"]');
        if (stackButtons) {
            setTimeout(() => {
                stackButtons.classList.add('hidden');
            }, 150);
        }
    }
}

function onStackBtnClick(e) {
    if (e.target.classList.contains('stack-btn')) {
        const value = e.target.dataset.value;
        const input = e.target.closest('.relative').querySelector('[data-type="unit-count"]');
        
        if (input) {
            input.value = value;
            calculateExpectedCost();
            e.target.closest('[data-type="stack-buttons"]').classList.add('hidden');
        }
    }
}


function updateMaterialIcon(inputElement) {
    const container = inputElement.closest('.relative');
    const iconImg = container.querySelector('.material-icon');
    const path = getIconPath(inputElement.value);
    
    if (iconImg) {
        iconImg.src = path;
        iconImg.style.display = path ? 'block' : 'none';
    }
}


function addLiveCalculators() {
    staminaAmountEl.addEventListener('input', calculateExpectedCost);
    staminaUnitCountEl.addEventListener('input', calculateExpectedCost);
    staminaUnitPriceEl.addEventListener('input', calculateExpectedCost);

    materialsListEl.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            calculateExpectedCost();

            if (e.target.dataset.type === 'material-name-input') {
                showMaterialDropdown(e.target);
                updateMaterialIcon(e.target); 
            }
        }
    });
    outcomesListEl.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            calculateExpectedCost();
        }
    });

    materialsListEl.addEventListener('focusin', (e) => {
        onUnitCountFocus(e);
    });
    
    materialsListEl.addEventListener('focusout', (e) => {
        onUnitCountBlur(e);
        if (e.target.dataset.type === 'material-name-input') {
            const dropdown = e.target.nextElementSibling;
            if (dropdown && dropdown.dataset.type === 'material-dropdown') {
                setTimeout(() => {
                    dropdown.classList.add('hidden');
                }, 150);
            }
        }
    });
    
    materialsListEl.addEventListener('click', onStackBtnClick);
}

addMaterialBtn.addEventListener('click', () => {
    addMaterialRow(); 
});
addOutcomeBtn.addEventListener('click', () => {
    addOutcomeRow(); 
});

materialsListEl.addEventListener('click', removeRow);
outcomesListEl.addEventListener('click', removeRow);


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [recipeResponse, nameResponse] = await Promise.all([
            fetch('recipes.json'),
            fetch('name.json')
        ]);
        presetRecipes = await recipeResponse.json();
        nameMap = await nameResponse.json();
    } catch (error) {
        console.error('레시피/이름 파일 로딩 실패 :', error);
    }

    addMaterialRow();
    addOutcomeRow();
    addLiveCalculators();
    
    itemNameInput.addEventListener('input', () => {
        showDropdown();
        
        const path = getIconPath(itemNameInput.value);
        if (path) {
            mainIcon.src = path;
            mainIcon.style.display = 'block';
        } else {
            mainIcon.src = '';  
            mainIcon.style.display = 'none'; 
        }
    });

    itemNameInput.addEventListener('focus', showDropdown);

    itemNameInput.addEventListener('blur', () => {
        setTimeout(() => {
            presetDropdown.classList.add('hidden');
            const path = getIconPath(itemNameInput.value);
            if (path) {
                mainIcon.src = path;
                mainIcon.style.display = 'block';
            } else {
                mainIcon.src = ''; 
                mainIcon.style.display = 'none'; 
            }
        }, 100);
    });
});