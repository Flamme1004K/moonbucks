// 오늘 얻은 인사이드
/*
    1. 이벤트 위임을 어떻게 할 수 있는지 알게 되서 좋았다.
    2. 요구사항을 전략적으로 접근해야하는지, 단계별로 세세하게 나누는게 중요하다는걸 알게 됐다.
    3. DOM 요소를 가져올때는 $표시를 써서 변수처럼 사용할 수 있는게 좋았다.
    4. 새롭게 알게 된 메서드 innerText, innerHTML, insertAdjacentHtml, closet, e.target
*/

// localStorage는 데이터를 저장하는 저장소이다.
import { $ } from './utils/dom.js'
import store from "./store/index.js";

function App() {
    //상태 변하는 데이터, 이 앱에서 변하는 것이 무엇인가? - 갯수, 메뉴명
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: []
    };
    this.currentCategory = 'espresso';
    this.init = () => {
        if (store.getLocalStorage()) {
            this.menu = store.getLocalStorage();
        }
        render();
        console.log(this)
        initEventListeners();
    }

    const render = () => {
        const template = this.menu[this.currentCategory].map((menuItem, index) => {
            return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                        <span class="w-100 pl-2 menu-name ${menuItem.soldOut ? 'sold-out' : ""}">${menuItem.name}</span>
                        <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                        >
                            품절
                        </button>
                        <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                        >
                        수정
                        </button>
                        <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                        >
                        삭제
                        </button>
                    </li>`;
        }).join("")

        //https://developer.mozilla.org/ko/docs/Web/API/Element/insertAdjacentHTML
        $("#menu-list").innerHTML = template;
        // 클래스 명을 가지고 변수를 짓자 li 갯수를 카운팅해서
        updateMenuCount();
    }

    // 상태값을 가질 수 있도록 선언
    const updateMenuCount = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $(".menu-count").innerText = `총 ${menuCount}개`;
    };

    const addMenuName = () => {
        if ($("#menu-name").value === "") {
            alert("값을 입력해주세요.");
            return
        }

        // 변수 앞에 $를 표시해주는 이유는 자바스크립트의 일반 변수와 구분해 주기 위해서 따로 표시를 주는 것이다.
        // 돔 element를 사용하는 변수는 변수 앞에$표시를 해준다
        const menuName = $("#menu-name").value;
        this.menu[this.currentCategory].push({ name: menuName });
        store.setLocalStorage(this.menu)
        render();
        $("#menu-name").value = "";
    };

    const updateMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name")
        //동등 뎁스의 태그는 속해있는 부모 태그로 올라가서 태그를 찾는게 좋다
        const updateMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
        this.menu[this.currentCategory][menuId].name = updateMenuName;
        store.setLocalStorage(this.menu);
        render();
    };

    const removeMenuName = (e) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu[this.currentCategory].splice(menuId, 1);
            store.setLocalStorage(this.menu);
            render();
        }
    };

    const soldOutMenu = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[this.currentCategory][menuId].soldOut =
            !this.menu[this.currentCategory][menuId].soldOut;
        store.setLocalStorage(this.menu);
        render();
    }

    const initEventListeners = () => {
        $("#menu-list").addEventListener("click", (e) => {
            if (e.target.classList.contains("menu-edit-button")) {
                updateMenuName(e);
                return
            };

            if (e.target.classList.contains("menu-remove-button")) {
                removeMenuName(e);
                return
            };

            if (e.target.classList.contains("menu-sold-out-button")) {
                soldOutMenu(e);
                return
            }
        });

        // form 태그가 자동으로 전송되는 것을 막아준다.
        $("#menu-form").addEventListener("submit", (e) => {
            e.preventDefault();
        });


        //event 함수를 사용하지 않으면 e를 생략하자
        $("#menu-submit-button").addEventListener("click", addMenuName);

        // 메뉴의 이름을 입력받는건
        $("#menu-name").addEventListener("keypress", (e) => {
            if (e.key !== 'Enter') {
                return
            }
            addMenuName();
        });

        $("nav").addEventListener("click", (e) => {
            const isCategoryButton = e.target.classList.contains("cafe-category-name")
            if (isCategoryButton) {
                const categoryName = e.target.dataset.categoryName;
                this.currentCategory = categoryName;
                $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
                render();
            }
        });
    };


}

const app = new App(); // new App 과 App()의 차이
app.init();
// app이 instance로 뛰어진다?
/*

    new로 만든 다는 것은 함수로 새로운 객체를 만들어서 각각의 상태를 만들 수 있다는 것이다.
    상태 값들이 저장이 되어야 동적인 웹페이지를 만들 수 있다.
*/
