export const loadingMixin = {
    computed : {
        isLoading() {
            if (this.saveButtonClicked) {
                return {
                    display: "block",
                };
            } else {
                return {
                    display: "none",
                };
            }
        },
    }
}