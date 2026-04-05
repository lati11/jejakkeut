let presetRecipes = {};
let nameMap = {};

const ITEM_CATEGORIES = {
    "못": "0급 기본재", "기본 접착제": "0급 기본재",
    "곰백토": "I급 기본재", "거친 종이": "I급 기본재", "반짝수": "I급 기본재", "베어 강력 접착제": "I급 기본재",
    "연마 가루": "II급 기본재", "베어 크리스탈": "II급 기본재", "탐욕의 실": "II급 기본재", "에너지 오브": "II급 기본재",
    "고품질 종이": "III급 기본재", "정화 플라스크": "III급 기본재", "체인": "III급 기본재", "보존 코어 소자": "III급 기본재", "영혼 가죽": "III급 기본재",
    "고품질 원단": "IV급 기본재", "정화의 결정": "IV급 기본재", "베어 철판": "IV급 기본재", "보존 코어 모듈": "IV급 기본재", "무두질된 영혼 가죽": "IV급 기본재",
    "베어 프린세스 모자": "UNCOMMON 교역품", "개량된 가죽 벨트": "UNCOMMON 교역품", "바다의 보물지도": "UNCOMMON 교역품", "선장의 미니 포켓백": "UNCOMMON 교역품", "타락의 안내서": "UNCOMMON 교역품", "수상한 약재 정제세트": "UNCOMMON 교역품", "천계의 찬란한 물약": "UNCOMMON 교역품", "타락한 요정의 상자": "UNCOMMON 교역품", "가죽 어깨 보호구": "UNCOMMON 교역품",
    "광휘의 정화석": "RARE 교역품", "스컬웹의 악의 구슬": "RARE 교역품", "불꽃 감옥 구슬": "RARE 교역품", "물방울 떡꼬치": "RARE 교역품", "환 약": "RARE 교역품", "수호의 증표": "RARE 교역품", "불길한 증표": "RARE 교역품",
    "바다의 울림 팬던트": "EPIC 교역품", "메뚜기떼의 해적 깃발": "EPIC 교역품", "날카로운 송곳니 너클": "EPIC 교역품", "엔더 소드": "EPIC 교역품", "루미너트 루프": "EPIC 교역품", "따스한 후드 점퍼": "EPIC 교역품",
    "드래곤 마법진": "LEGENDARY 교역품", "곤충 채집통": "LEGENDARY 교역품", "위더 크루세이더의 갑옷": "LEGENDARY 교역품", "맹독의 손길": "LEGENDARY 교역품", "여의주": "LEGENDARY 교역품"
};

const TIER4_FAIL_MAP = {
    "고품질 원단": "고품질 종이",
    "정화의 결정": "정화 플라스크",
    "보존 코어 모듈": "보존 코어 소자",
    "베어 철판": "체인",
    "무두질된 영혼 가죽": "영혼 가죽"
};

function getCategory(itemName) {
    return ITEM_CATEGORIES[itemName] || itemName; 
}

function formatNum(val) {
    if (val === '' || val === undefined || val === null) return '';
    const numStr = String(val).replace(/[^0-9.]/g, ''); 
    if (numStr === '') return '';
    const parts = numStr.split('.');
    parts[0] = Number(parts[0]).toLocaleString('ko-KR');
    return parts.join('.');
}

function parseNum(val) {
    if (!val) return 0;
    return Number(String(val).replace(/,/g, '')) || 0;
}

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
const saveResultBtn = document.getElementById('save-result-btn');

function getIconPath(koreanName) {
    const englishName = nameMap[koreanName];
    if (englishName) {
        return `images/${englishName}.png`;
    }
    return "";
}

function addMaterialRow(defaultName = '', defaultAmount = '') {
    const wrapper = document.createElement('div');
    wrapper.className = "material-row flex items-center gap-2";
    const iconPath = getIconPath(defaultName);
    wrapper.innerHTML = `
        <div class="flex-grow flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-2 border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/30 transition-colors">
            
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div class="relative w-60">
                    <img src="${iconPath}" alt=""
                        class="material-icon absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5" 
                        style="display: ${iconPath ? 'block' : 'none'}" 
                        onerror="this.style.display='none'">
                    
                    <input type="text" placeholder="재료 이름" value="${defaultName}"
                        data-type="material-name-input"
                        class="pl-10 py-1 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md w-full transition-colors"
                        autocomplete="off">

                    <div data-type="material-dropdown" 
                         class="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-md shadow-lg mt-1 hidden max-h-40 overflow-y-auto">
                    </div>
                </div>
            
                <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">x</label>
                    <input type="text" inputmode="numeric" data-type="required" placeholder="개수" value="${formatNum(defaultAmount)}"
                           class="w-12 py-1 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md text-right transition-colors">
                </div>
            </div>

            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">시세</label>
                
                <div class="relative flex items-center gap-1 py-0.2 px-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 transition-colors">
                    
                    <div data-type="stack-buttons" class="absolute absolute -bottom-5 left-0 flex gap-1 hidden">
                        <button type="button" data-value="16" class="stack-btn py-0 px-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-200 rounded">16</button>
                        <button type="button" data-value="32" class="stack-btn py-0 px-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-200 rounded">32</button>
                        <button type="button" data-value="64" class="stack-btn py-0 px-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-200 rounded">64</button>
                    </div>

                    <input type="text" inputmode="numeric" data-type="unit-count" value="1" 
                           class="w-14 py-1 px-2 border-none bg-transparent dark:text-white rounded-md text-right focus:ring-0 focus:border-none">
                    <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">개당</span>
                    <input type="text" inputmode="numeric" data-type="unit-price"
                           class="w-32 py-1 px-2 border-none bg-transparent dark:text-white rounded-md text-right focus:ring-0 focus:border-none">
                    <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">코인</span>
                </div>
            </div>

        </div>
        <button class="remove-btn inline-block transform rotate-45 text-black dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-2xl font-light p-1 rounded-md flex-shrink-0 transition-colors">+</button>
    `;
    materialsListEl.appendChild(wrapper);
}

function addOutcomeRow(itemName = '', defaultAmount = '', defaultProb = '', isByproduct = false, defaultPrice = '') {
    const wrapper = document.createElement('div');
    const bgClass = isByproduct ? 'bg-gray-200/50 dark:bg-gray-600/50 byproduct-row' : 'bg-gray-50 dark:bg-gray-700/30';
    wrapper.className = `outcome-row flex items-center gap-2 w-full ${isByproduct ? 'byproduct-row' : ''}`;
    if (itemName) wrapper.dataset.itemName = itemName;

    const iconPath = getIconPath(itemName);
    
    let nameHtml = itemName ? `
        <div class="flex items-center gap-2 flex-shrink-0 min-w-[120px]">
            <img src="${iconPath}" class="w-5 h-5" onerror="this.style.display='none'">
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">${itemName}</span>
        </div>
    ` : '';

    let priceHtml = isByproduct ? `
        <div class="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-500">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">시세</label>
            <input type="text" inputmode="numeric" data-type="outcome-price" value="${formatNum(defaultPrice)}" placeholder="코인" class="w-24 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white text-right text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
        </div>
    ` : '';

    wrapper.innerHTML = `
        <div class="flex-grow flex items-center p-2 border dark:border-gray-600 rounded-md ${bgClass} transition-colors">
            ${nameHtml}
            ${priceHtml}
            
            <div class="flex-grow"></div> <div class="flex items-center gap-4 flex-shrink-0">
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">개수</label>
                    <input type="text" inputmode="numeric" data-type="outcome-amount" value="${formatNum(defaultAmount)}" class="w-16 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white text-right text-sm outline-none transition-colors">
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">확률</label>
                    <input type="text" inputmode="numeric" data-type="outcome-prob" value="${formatNum(defaultProb)}" class="w-16 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white text-right text-sm outline-none transition-colors">
                    <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">%</span>
                </div>
            </div>
        </div>
        <button class="remove-btn inline-block transform rotate-45 text-black dark:text-gray-400 hover:text-red-500 text-2xl font-light p-1 rounded-md transition-colors flex-shrink-0">+</button>
    `;
    outcomesListEl.appendChild(wrapper);
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
        item.className = 'flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors';
        
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

    const filter = filterValue.toUpperCase(); 
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
        item.className = 'flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors';
        
        item.addEventListener('mousedown', () => { 
            const container = inputElement.closest('.relative');
            const iconImg = container.querySelector('.material-icon');
            const rowWrapper = inputElement.closest('.material-row');
            
            inputElement.value = key; 
            iconImg.src = iconPath; 
            iconImg.style.display = iconPath ? 'block' : 'none'; 
            dropdown.classList.add('hidden');
            const autoSavePrice = document.getElementById('auto-save-price').checked;
            if (autoSavePrice) {
                const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
                if (savedPrices[key]) {
                    rowWrapper.querySelector('[data-type="unit-count"]').value = formatNum(savedPrices[key].unitCount);
                    rowWrapper.querySelector('[data-type="unit-price"]').value = formatNum(savedPrices[key].unitPrice);
                }
            }
            calculateExpectedCost(); 
        });
        dropdown.appendChild(item);
    });
    dropdown.classList.remove('hidden');
}

function removeRow(e) {
    if (e.target.classList.contains('remove-btn')) {
        e.target.closest('.material-row, .outcome-row').remove();
        calculateExpectedCost();
    }
}

function applyRecipe(recipeKey) {
    const recipe = presetRecipes[recipeKey];
    if (!recipe) return;
    const mainIconPath = getIconPath(recipeKey);
    mainIcon.src = mainIconPath;
    mainIcon.style.display = mainIconPath ? 'block' : 'none';

    staminaAmountEl.value = formatNum(recipe.stamina);

    materialsListEl.innerHTML = '';
    outcomesListEl.innerHTML = '';

    const autoSavePrice = document.getElementById('auto-save-price')?.checked;
    const autoSaveOutcome = document.getElementById('auto-save-outcome')?.checked;
    const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
    const savedOutcomes = JSON.parse(localStorage.getItem('savedOutcomes')) || {};

    recipe.materials.forEach(mat => {
        addMaterialRow(mat.name, mat.amount);
    });

    if (autoSavePrice) {
        const materialRows = materialsListEl.querySelectorAll('.material-row');
        materialRows.forEach(row => {
            const name = row.querySelector('[data-type="material-name-input"]').value;
            if (savedPrices[name]) {
                row.querySelector('[data-type="unit-count"]').value = formatNum(savedPrices[name].unitCount);
                row.querySelector('[data-type="unit-price"]').value = formatNum(savedPrices[name].unitPrice);
            }
        });
    }

    const category = getCategory(recipeKey);
    const failItem = TIER4_FAIL_MAP[recipeKey];

    if (failItem) {
        let mainProb = '', failProb = '';
        if (autoSaveOutcome && savedOutcomes[category] && savedOutcomes[category].length >= 2) {
            mainProb = savedOutcomes[category][0].prob;
            failProb = savedOutcomes[category][1].prob;
        }

        let failPrice = '';
        if (savedPrices[failItem]) {
            failPrice = savedPrices[failItem].unitPrice / savedPrices[failItem].unitCount; 
        }
        addOutcomeRow(recipeKey, 1, mainProb, false);
        addOutcomeRow(failItem, 1, failProb, true, failPrice);

    } else {
        if (autoSaveOutcome && savedOutcomes[category] && savedOutcomes[category].length > 0) {
            savedOutcomes[category].forEach(out => {
                addOutcomeRow('', out.amount, out.prob);
            });
        } else {
            recipe.outcomes.forEach(out => {
                addOutcomeRow('', out.amount, out.prob !== undefined ? out.prob : '');
            });
        }
    }
    
    calculateExpectedCost();
}

function calculateExpectedCost() {
    let totalCost = 0;

    const staminaValue = parseNum(staminaAmountEl.value);
    const staminaUnitCount = parseNum(staminaUnitCountEl.value) || 1;
    const staminaUnitPrice = parseNum(staminaUnitPriceEl.value);
    const staminaCostPerUnit = staminaUnitPrice / staminaUnitCount;
    totalCost += staminaValue * staminaCostPerUnit;

    const materialRows = materialsListEl.querySelectorAll('.material-row');
    const autoSavePrice = document.getElementById('auto-save-price')?.checked;
    const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};

    materialRows.forEach(row => {
        const nameElement = row.querySelector('[data-type="material-name-input"]');
        const requiredAmount = parseNum(row.querySelector('[data-type="required"]').value);
        const unitCount = parseNum(row.querySelector('[data-type="unit-count"]').value) || 1;
        const unitPrice = parseNum(row.querySelector('[data-type="unit-price"]').value);

        if (autoSavePrice && nameElement && nameElement.value && unitPrice > 0) {
            savedPrices[nameElement.value] = { unitCount, unitPrice };
        }

        const pricePerItem = unitPrice / unitCount;
        totalCost += pricePerItem * requiredAmount;
    });

    let expectedMainAmount = 0; 
    let byproductRecovery = 0; 
    
    const outcomeRows = outcomesListEl.querySelectorAll('.outcome-row');
    const autoSaveOutcome = document.getElementById('auto-save-outcome')?.checked;
    const outcomesToSave = [];

    outcomeRows.forEach(row => {
        const amount = parseNum(row.querySelector('[data-type="outcome-amount"]').value);
        const probability = parseNum(row.querySelector('[data-type="outcome-prob"]').value);
        const isByproduct = row.classList.contains('byproduct-row');

        if (amount > 0 || probability > 0) {
            outcomesToSave.push({ amount, prob: probability });
        }

        if (isByproduct) {
            const priceInput = row.querySelector('[data-type="outcome-price"]');
            const price = parseNum(priceInput?.value);
            byproductRecovery += amount * (probability / 100) * price;
            
            if (autoSavePrice && price > 0 && row.dataset.itemName) {
                savedPrices[row.dataset.itemName] = { unitCount: 1, unitPrice: price };
            }
        } else {
            expectedMainAmount += amount * (probability / 100);
        }
    });

    if (autoSavePrice) localStorage.setItem('savedPrices', JSON.stringify(savedPrices));
    
    if (autoSaveOutcome && itemNameInput.value && outcomesToSave.length > 0) {
        const category = getCategory(itemNameInput.value);
        const savedOutcomes = JSON.parse(localStorage.getItem('savedOutcomes')) || {};
        savedOutcomes[category] = outcomesToSave;
        localStorage.setItem('savedOutcomes', JSON.stringify(savedOutcomes));
    }

    totalCost -= byproductRecovery;

    let costPerItem = 0;
    if (expectedMainAmount > 0) {
        costPerItem = totalCost / expectedMainAmount;
    }
    
    if (costPerItem <= 0 || !isFinite(costPerItem)) {
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
            input.value = formatNum(value);
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

document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.getAttribute('inputmode') === 'numeric') {
        let val = e.target.value;
        if (val.endsWith('.')) return; 
        e.target.value = formatNum(val);
    }
});

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

saveResultBtn.addEventListener('click', () => {
    const currentItem = itemNameInput.value.trim();
    const currentCost = parseNum(resultCostEl.textContent);

    if (!currentItem) {
        alert("아이템 선택 후 재료 정보를 적어주세요.");
        return;
    }
    if (currentCost <= 0) {
        alert("저장할 제작비가 계산되지 않았어요.");
        return;
    }

    const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
    savedPrices[currentItem] = { unitCount: 1, unitPrice: currentCost };
    localStorage.setItem('savedPrices', JSON.stringify(savedPrices));

    const originalText = saveResultBtn.textContent;
    saveResultBtn.textContent = "✔ 저장됨";
    setTimeout(() => {
        saveResultBtn.textContent = originalText;
    }, 1500);
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

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    const toggleCircle = document.getElementById("toggle-circle");
    const iconSun = document.getElementById("icon-sun");
    const iconMoon = document.getElementById("icon-moon");
    const html = document.documentElement;
  
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (html.classList.contains("dark")) {
          disableDarkMode();
        } else {
          enableDarkMode();
        }
      });
    }
  
    function enableDarkMode() {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      
      toggleCircle.classList.add("translate-x-4");
      
      iconSun.classList.remove("opacity-100");
      iconSun.classList.add("opacity-0");
      iconMoon.classList.remove("opacity-0");
      iconMoon.classList.add("opacity-100");
    }
  
    function disableDarkMode() {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      
      toggleCircle.classList.remove("translate-x-4");
      
      iconSun.classList.remove("opacity-0");
      iconSun.classList.add("opacity-100");
      iconMoon.classList.remove("opacity-100");
      iconMoon.classList.add("opacity-0");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('data-modal');
    const modalContent = document.getElementById('data-modal-content');
    const openBtn = document.getElementById('data-book-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    
    const tabPriceBtn = document.getElementById('tab-price-btn');
    const tabOutcomeBtn = document.getElementById('tab-outcome-btn');
    const contentArea = document.getElementById('modal-content-area');

    let currentTab = 'price'; 

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        renderModalContent(); 
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); 
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    tabPriceBtn.addEventListener('click', () => {
        currentTab = 'price';
        updateTabStyles();
        renderModalContent();
    });

    tabOutcomeBtn.addEventListener('click', () => {
        currentTab = 'outcome';
        updateTabStyles();
        renderModalContent();
    });

    function updateTabStyles() {
        if (currentTab === 'price') {
            tabPriceBtn.className = "flex-1 py-3 text-center font-bold text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 transition-colors";
            tabOutcomeBtn.className = "flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent transition-colors";
        } else {
            tabOutcomeBtn.className = "flex-1 py-3 text-center font-bold text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 transition-colors";
            tabPriceBtn.className = "flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent transition-colors";
        }
    }

    function renderModalContent() {
        if (currentTab === 'price') {
            renderPriceTab();
        } else {
            renderOutcomeTab();
        }
    }

    function renderPriceTab() {
        const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
        const items = Object.keys(nameMap).sort(); 
        
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">';
        items.forEach(key => {
            const iconPath = getIconPath(key);
            const saved = savedPrices[key] || { unitCount: '', unitPrice: '' };
            
            html += `
            <div class="flex items-center justify-between p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 shadow-sm">
                <div class="flex items-center gap-2 overflow-hidden">
                    <img src="${iconPath}" class="w-5 h-5 flex-shrink-0" onerror="this.style.display='none'">
                    <span class="text-sm font-medium dark:text-gray-200 truncate">${key}</span>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                    <input type="text" inputmode="numeric" data-type="modal-price-count" data-key="${key}" value="${formatNum(saved.unitCount)}" placeholder="개수" class="w-8 py-1 px-1 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 dark:text-white text-right text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                    <span class="text-gray-500 dark:text-gray-400 text-xs">개당</span>
                    <input type="text" inputmode="numeric" data-type="modal-price-price" data-key="${key}" value="${formatNum(saved.unitPrice)}" placeholder="코인" class="w-24 py-1 px-1 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 dark:text-white text-right text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                </div>
            </div>`;
        });
        html += '</div>';
        contentArea.innerHTML = html;
    }

    function renderOutcomeTab() {
        const savedOutcomes = JSON.parse(localStorage.getItem('savedOutcomes')) || {};
        
        const categories = [
            "0급 기본재", "I급 기본재", "II급 기본재", 
            "III급 기본재", "IV급 기본재", 
            "UNCOMMON 교역품", "RARE 교역품", "EPIC 교역품", "LEGENDARY 교역품"
        ];

        function getDefaultOutcomes(categoryName) {
            for (const key in presetRecipes) {
                if (getCategory(key) === categoryName) {
                    return presetRecipes[key].outcomes.map(out => ({
                        amount: out.amount,
                        prob: out.prob !== undefined ? out.prob : ''
                    }));
                }
            }
            return [{ amount: '', prob: '' }]; 
        }

        let html = '<div class="space-y-4">';
        categories.forEach(cat => {
            let saved = (savedOutcomes[cat] && savedOutcomes[cat].length > 0) 
                          ? savedOutcomes[cat] 
                          : getDefaultOutcomes(cat);
            
            if (cat === "IV급 기본재" && saved.length < 2) {
                saved.push({ amount: '', prob: '' });
            }
            
            html += `
            <div class="p-4 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <h4 class="font-bold text-gray-800 dark:text-white mb-3 border-b dark:border-gray-600 pb-1">${cat}</h4>
                <div class="space-y-2 flex flex-col items-end" id="modal-cat-${cat}">`;
            
            saved.forEach((out, idx) => {
                const isTier4Fail = (cat === 'IV급 기본재' && idx === 1);
                const bgClass = isTier4Fail ? 'bg-gray-200/50 dark:bg-gray-600/50' : 'bg-transparent';
                const labelText = cat === 'IV급 기본재' ? (idx === 0 ? '성공' : '실패 (3급재)') : '';
                
                const labelHtml = labelText ? `<span class="text-sm font-bold text-gray-500 dark:text-gray-300">${labelText}</span>` : '<div class="flex-grow"></div>';

                html += `
                <div class="flex items-center w-full justify-between py-1 px-2 rounded-md ${bgClass} transition-colors">
                    ${labelHtml}
                    <div class="flex items-center gap-2">
                        <input type="text" inputmode="numeric" data-type="modal-out-amount" data-cat="${cat}" value="${formatNum(out.amount)}" placeholder="개수" class="w-16 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white text-right text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                        <span class="text-sm text-gray-500 dark:text-gray-400">개</span>
                        <span class="text-gray-300 dark:text-gray-500 mx-1">|</span>
                        <input type="text" inputmode="numeric" data-type="modal-out-prob" data-cat="${cat}" value="${formatNum(out.prob)}" placeholder="확률" class="w-16 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white text-right text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                        <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
                    </div>
                </div>`;
            });
            html += `</div></div>`;
        });
        html += '</div>';
        contentArea.innerHTML = html;
    }

    contentArea.addEventListener('input', (e) => {
        const target = e.target;
        const type = target.dataset.type;

        if (type === 'modal-price-count' || type === 'modal-price-price') {
            const key = target.dataset.key;
            const row = target.closest('.flex.items-center.justify-between');
            const countVal = parseNum(row.querySelector('[data-type="modal-price-count"]').value);
            const priceVal = parseNum(row.querySelector('[data-type="modal-price-price"]').value);

            const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
            if (countVal || priceVal) {
                savedPrices[key] = { unitCount: countVal || 1, unitPrice: priceVal || 0 };
            } else {
                delete savedPrices[key]; 
            }
            localStorage.setItem('savedPrices', JSON.stringify(savedPrices));
        }

        if (type === 'modal-out-amount' || type === 'modal-out-prob') {
            const cat = target.dataset.cat;
            const catContainer = document.getElementById(`modal-cat-${cat}`);
            const amountInputs = catContainer.querySelectorAll('[data-type="modal-out-amount"]');
            const probInputs = catContainer.querySelectorAll('[data-type="modal-out-prob"]');

            const newOutcomes = [];
            for (let i = 0; i < amountInputs.length; i++) {
                const amt = parseNum(amountInputs[i].value);
                const prb = parseNum(probInputs[i].value);
                if (amt || prb) {
                    newOutcomes.push({ amount: amt || 0, prob: prb || 0 });
                }
            }

            const savedOutcomes = JSON.parse(localStorage.getItem('savedOutcomes')) || {};
            if (newOutcomes.length > 0) {
                savedOutcomes[cat] = newOutcomes;
            } else {
                delete savedOutcomes[cat]; 
            }
            localStorage.setItem('savedOutcomes', JSON.stringify(savedOutcomes));
        }
        
        calculateExpectedCost(); 
    });
});


const ALTAR_BASE_SCORES = {
    "드래곤 마법진": 2000, "곤충 채집통": 2000, "위더 크루세이더의 갑옷": 2000, "맹독의 손길": 2000, "여의주": 2000,
    "바다의 울림 팬던트": 750, "메뚜기떼의 해적 깃발": 750, "날카로운 송곳니 너클": 750, "엔더 소드": 750, "루미너트 루프": 750, "따스한 후드 점퍼": 750,
    "광휘의 정화석": 300, "스컬웹의 악의 구슬": 300, "불꽃 감옥 구슬": 300, "물방울 떡꼬치": 300, "환 약": 300, "수호의 증표": 300, "불길한 증표": 300,
    "베어 프린세스 모자": 100, "개량된 가죽 벨트": 100, "바다의 보물지도": 100, "선장의 미니 포켓백": 100, "타락의 안내서": 100, "수상한 약재 정제세트": 100, "천계의 찬란한 물약": 100, "타락한 요정의 상자": 100, "가죽 어깨 보호구": 100
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('altar-modal');
    const modalContent = document.getElementById('altar-modal-content');
    const openBtn = document.getElementById('altar-calc-btn');
    const closeBtn = document.getElementById('close-altar-modal-btn');
    const itemsArea = document.getElementById('altar-items-area');
    const targetScoreInput = document.getElementById('altar-target-score');
    const multiplierInput = document.getElementById('altar-multiplier');
    const runBtn = document.getElementById('run-altar-calc-btn');
    const resultArea = document.getElementById('altar-result-area');

    const savedAltarSettings = JSON.parse(localStorage.getItem('altarSettings')) || { targetScore: 0, multiplier: 1.0, forced: {} };
    targetScoreInput.value = formatNum(savedAltarSettings.targetScore);
    multiplierInput.value = savedAltarSettings.multiplier;

    openBtn?.addEventListener('click', () => {
        modal.classList.remove('hidden');
        renderAltarItems();
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
    });

    closeBtn?.addEventListener('click', closeAltarModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeAltarModal(); });

    function closeAltarModal() {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    [targetScoreInput, multiplierInput].forEach(el => {
        el.addEventListener('input', saveAltarSettings);
    });

    function saveAltarSettings() {
        const forced = {};
        const rows = itemsArea.querySelectorAll('.altar-item-row');
        rows.forEach(row => {
            const name = row.dataset.name;
            const count = parseNum(row.querySelector('[data-type="altar-force"]').value);
            if (count > 0) forced[name] = count;
        });
        localStorage.setItem('altarSettings', JSON.stringify({
            targetScore: parseNum(targetScoreInput.value),
            multiplier: Number(multiplierInput.value) || 1.0,
            forced: forced
        }));
    }

    function renderAltarItems() {
        const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
        const savedAltarSettings = JSON.parse(localStorage.getItem('altarSettings')) || { forced: {} };
        const forcedCounts = savedAltarSettings.forced || {};

        const groups = { "LEGENDARY": [], "EPIC": [], "RARE": [], "UNCOMMON": [] };
        
        for (const [name, score] of Object.entries(ALTAR_BASE_SCORES)) {
            if (score === 2000) groups["LEGENDARY"].push(name);
            else if (score === 750) groups["EPIC"].push(name);
            else if (score === 300) groups["RARE"].push(name);
            else groups["UNCOMMON"].push(name);
        }

        let html = '<div class="space-y-4">';
        for (const [groupName, items] of Object.entries(groups)) {
            let color = "text-yellow-600 dark:text-yellow-400";
            if(groupName==="EPIC") color = "text-purple-600 dark:text-purple-400";
            if(groupName==="RARE") color = "text-blue-600 dark:text-blue-400";
            if(groupName==="UNCOMMON") color = "text-green-600 dark:text-green-400";

            html += `<div class="p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                        <h4 class="font-bold ${color} mb-2 border-b dark:border-gray-600 pb-1">${groupName} 교역품</h4>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">`;
            
            items.forEach(name => {
                const price = savedPrices[name]?.unitPrice || '';
                const force = forcedCounts[name] || '';
                const iconPath = getIconPath(name);
                
                html += `
                <div class="altar-item-row flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-600" data-name="${name}">
                    <div class="flex items-center gap-2 overflow-hidden w-1/2">
                        <img src="${iconPath}" class="w-5 h-5 flex-shrink-0" onerror="this.style.display='none'">
                        <span class="text-sm font-medium dark:text-gray-200 truncate" title="${name}">${name}</span>
                    </div>
                    <div class="flex flex-col items-end gap-1 w-1/2">
                        <div class="flex items-center">
                            <span class="text-xs text-gray-500 mr-1">시세</span>
                            <input type="text" inputmode="numeric" data-type="altar-price" value="${formatNum(price)}" placeholder="코인" class="w-24 py-1 px-1 border dark:border-gray-500 rounded bg-white dark:bg-gray-700 dark:text-white text-right text-xs focus:ring-1 focus:ring-blue-500 outline-none">
                        </div>
                        <div class="flex items-center">
                            <span class="text-xs text-gray-500 mr-1">포함시킬 개수</span>
                            <input type="text" inputmode="numeric" data-type="altar-force" value="${formatNum(force)}" placeholder="개" class="w-10 py-1 px-1 border dark:border-gray-500 rounded bg-white dark:bg-gray-700 dark:text-white text-right text-xs focus:ring-1 focus:ring-blue-500 outline-none">
                        </div>
                    </div>
                </div>`;
            });
            html += `</div></div>`;
        }
        html += '</div>';
        itemsArea.innerHTML = html;
    }

    itemsArea?.addEventListener('input', (e) => {
        const target = e.target;
        const row = target.closest('.altar-item-row');
        if (!row) return;

        const name = row.dataset.name;
        if (target.dataset.type === 'altar-price') {
            const priceVal = parseNum(target.value);
            const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
            if (priceVal > 0) {
                savedPrices[name] = { unitCount: 1, unitPrice: priceVal };
            } else {
                delete savedPrices[name];
            }
            localStorage.setItem('savedPrices', JSON.stringify(savedPrices));
        } else if (target.dataset.type === 'altar-force') {
            saveAltarSettings();
        }
    });

    runBtn?.addEventListener('click', () => {
        const targetScore = parseNum(targetScoreInput.value);
        const multiplier = Number(multiplierInput.value) || 1.0;
        
        if (targetScore <= 0) {
            alert("목표 점수를 입력해주세요!"); return;
        }

        const savedPrices = JSON.parse(localStorage.getItem('savedPrices')) || {};
        const savedAltarSettings = JSON.parse(localStorage.getItem('altarSettings')) || { forced: {} };
        const forced = savedAltarSettings.forced || {};

        const itemsList = Object.keys(ALTAR_BASE_SCORES).map(name => ({
            name: name,
            baseScore: ALTAR_BASE_SCORES[name],
            price: savedPrices[name]?.unitPrice || Infinity 
        }));

        let counts = {};
        itemsList.forEach(item => counts[item.name] = forced[item.name] || 0);

        function getState(cObj) {
            let cost = 0, scoreSum = 0, totalItems = 0;
            for (let i = 0; i < itemsList.length; i++) {
                const name = itemsList[i].name;
                const count = cObj[name];
                if (count === 0) continue;
                
                totalItems += count;
                const added = Math.max(0, count - (forced[name] || 0));
                cost += added * itemsList[i].price;
                
                for (let k = 0; k < count; k++) {
                    scoreSum += Math.floor(itemsList[i].baseScore * Math.max(0.5, 1.0 - k * 0.1));
                }
            }
            return { cost, score: Math.floor(scoreSum * multiplier), totalItems, scoreSum };
        }

        while (true) {
            const state = getState(counts);
            if (state.score >= targetScore) break;
            
            let bestMove = null;
            let minMarginalCost = Infinity;

            if (state.totalItems < 64) {
                for (let i = 0; i < itemsList.length; i++) {
                    if (itemsList[i].price === Infinity) continue;
                    const gainScoreBase = Math.floor(itemsList[i].baseScore * Math.max(0.5, 1.0 - counts[itemsList[i].name] * 0.1));
                    if (gainScoreBase <= 0) continue;
                    
                    const newScoreSum = state.scoreSum + gainScoreBase;
                    const actualGain = Math.floor(newScoreSum * multiplier) - state.score;
                    if (actualGain <= 0) continue;

                    const ratio = itemsList[i].price / actualGain;
                    if (ratio < minMarginalCost) { minMarginalCost = ratio; bestMove = { type: 'add', name: itemsList[i].name }; }
                }
            } 
            if (state.totalItems >= 64) {
                for (let r = 0; r < itemsList.length; r++) {
                    const remName = itemsList[r].name;
                    if (counts[remName] > (forced[remName] || 0)) {
                        const lossScoreBase = Math.floor(itemsList[r].baseScore * Math.max(0.5, 1.0 - (counts[remName] - 1) * 0.1));
                        
                        for (let a = 0; a < itemsList.length; a++) {
                            const addName = itemsList[a].name;
                            if (remName === addName || itemsList[a].price === Infinity) continue;
                            
                            const gainScoreBase = Math.floor(itemsList[a].baseScore * Math.max(0.5, 1.0 - counts[addName] * 0.1));
                            
                            const newScoreSum = state.scoreSum - lossScoreBase + gainScoreBase;
                            const actualGain = Math.floor(newScoreSum * multiplier) - state.score;
                            
                            if (actualGain > 0) {
                                const costDiff = itemsList[a].price - itemsList[r].price;
                                const ratio = costDiff / actualGain;
                                if (ratio < minMarginalCost) { 
                                    minMarginalCost = ratio; 
                                    bestMove = { type: 'replace', addName: addName, remName: remName }; 
                                }
                            }
                        }
                    }
                }
            }

            if (bestMove) {
                if (bestMove.type === 'add') counts[bestMove.name]++;
                else { counts[bestMove.remName]--; counts[bestMove.addName]++; }
            } else {
                break; 
            }
        }

        while (true) {
            const state = getState(counts);
            let bestRemName = null, maxSaveRatio = -Infinity;

            for (let i = 0; i < itemsList.length; i++) {
                const name = itemsList[i].name;
                if (counts[name] > (forced[name] || 0)) {
                    const lossScoreBase = Math.floor(itemsList[i].baseScore * Math.max(0.5, 1.0 - (counts[name] - 1) * 0.1));
                    const newScoreSum = state.scoreSum - lossScoreBase;
                    const newScore = Math.floor(newScoreSum * multiplier);
                    
                    if (newScore >= targetScore) {
                        const actualLoss = state.score - newScore;
                        const ratio = actualLoss > 0 ? itemsList[i].price / actualLoss : Infinity; 
                        if (ratio > maxSaveRatio) { maxSaveRatio = ratio; bestRemName = name; }
                    }
                }
            }
            if (bestRemName) counts[bestRemName]--;
            else break;
        }

        const finalState = getState(counts);
        
        let resultHtml = "";
        let totalAddedCost = 0;

        itemsList.forEach(item => {
            const totalCount = counts[item.name];
            const forceCount = forced[item.name] || 0;
            const addCount = Math.max(0, totalCount - forceCount);

            if (totalCount > 0) {
                let badge = "";
                if (forceCount > 0) {
                    badge = addCount === 0 ? `<span class="text-xs bg-gray-200 text-gray-600 px-1 rounded ml-2">보유템 사용</span>` 
                                           : `<span class="text-xs bg-blue-100 text-blue-600 px-1 rounded ml-2">${forceCount}개 보유</span>`;
                }

                const iconPath = getIconPath(item.name);
                
                resultHtml += `<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-600/50 py-2">
                                  <div class="flex items-center gap-2">
                                  <img src="${iconPath}" class="w-5 h-5 flex-shrink-0" onerror="this.style.display='none'">
                                      <div class="text-sm dark:text-gray-200">${item.name} <strong class="ml-1">${totalCount}개</strong>${badge}</div>
                                  </div>`;
                if (addCount > 0) {
                    resultHtml += `<div class="text-gray-500 dark:text-gray-400">${addCount}개 추가 ➝ ${formatNum(addCount * item.price)} 코인</div>`;
                } else {
                    resultHtml += `<div class="text-gray-400 text-xs mt-0.5">추가 불필요</div>`;
                }
                resultHtml += `</div>`;
                
                totalAddedCost += addCount * item.price;
            }
        });

        if (finalState.score < targetScore) {
            resultHtml = `<div class="text-red-500 font-bold">⚠️ 시세가 등록된 아이템이 부족하여 64개를 채워도 목표 점수에 도달할 수 없습니다.</div>` + resultHtml;
        }

        document.getElementById('altar-res-cost').textContent = formatNum(totalAddedCost) + " 코인";
        
        const scoreEl = document.getElementById('altar-res-score');
        scoreEl.textContent = formatNum(finalState.score) + " 점";
        scoreEl.className = finalState.score >= targetScore ? "text-xl font-bold text-green-600 dark:text-green-400" : "text-xl font-bold text-red-600 dark:text-red-400";
        
        const countEl = document.getElementById('altar-res-count');
        countEl.textContent = `${finalState.totalItems} / 64`;
        countEl.className = finalState.totalItems === 64 ? "text-lg font-bold text-red-500" : "text-lg font-bold text-gray-900 dark:text-white";

        document.getElementById('altar-res-list').innerHTML = resultHtml || "추가 구매가 필요하지 않거나, 시세 정보가 없습니다.";
        resultArea.classList.remove('hidden');
    });
});