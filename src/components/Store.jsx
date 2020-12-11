import { Store } from "pullstate";
import { auth } from "../firebase";

export const userStore = new Store({
    user: false,
});

auth.onAuthStateChanged((user) => {
    userStore.update((s) => {
        console.log("auth", user);
        if (user) {
            s.user = user;
        } else s.user = user;
    });
});
