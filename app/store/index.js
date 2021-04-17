export const state = () => ({
    title: 'Page Quality Monitor',
})
     
export const mutations = {
    CHANGE_PAGE_TITLE(state, title) {
        state.title = title;
    }
}