const store = {
    setLocalStorage(menu) {
        localStorage.setItem("menu", JSON.stringify(menu)) //문자열 형태로만 저장시켜야한다.
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("menu")) // 문자열로 전달 된 데이터를 다시 JSON parse해야한다.
    }
}

export default store;