import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    server: "https://localhost:44386/serviciocliente.asmx/",
    server2: "https://localhost:44386/",
    rutaEscrituras: "https://localhost:44386/escrituras/",
    /*server: "http://localhost/serviciocliente.asmx/",
    server2: "http://localhost/",
    rutaEscrituras: "http://localhost/escrituras/",
    server: "serviciocliente.asmx/",
    server2: "/",
    rutaEscrituras: "/escrituras/"*/
  },
  mutations: {},
  actions: {},
});
