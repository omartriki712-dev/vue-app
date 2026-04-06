import {createApp} from "vue";
import App from "./App.vue";
import SharedLayout from "./dashboard/components/SharedLayout.vue";

const app = createApp(App);

app.component('SharedLayout', SharedLayout);

export default app;
