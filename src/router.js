import Vue from 'vue'
import Router from 'vue-router'
import Cliente from './views/Cliente'
import Institución from './views/Institución'
import Cargos from './views/Cargos'
import Estudios from './views/Estudios'
import Expedientes from './views/Expedientes'
import Escrituras from './views/Registro de escrituras'
import ConsultaCliente from './views/Consulta_Cliente'
import Consultainstitucion from './views/Consulta de instituciones'




Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [{
      path: '/Cliente',
      name: 'Cliente',
      component: Cliente
    },
    {
      path: '/Institución',
      name: 'Institución',
      component: Institución

    },
    {
      path: '/Cargos',
      name: 'Cargos',
      component: Cargos
    },
    {
      path: '/Estudios',
      name: 'Estudios',
      component: Estudios
    },
    
    {
      path: '/Expedientes',
      name: 'Expedientes',
      component: Expedientes
    },
    {
      path: '/Registro de escrituras',
      name: 'Registro de escrituras',
      component: Escrituras
    },
{
  path:'/Consulta_Cliente',
  name:'Consulta_Cliente',
  component:ConsultaCliente
},
{
  path:'/Consulta de instituciones',
  name:'Consulta de instituciones',
  component:Consultainstitucion
}
    /*{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" './views/About.vue')

    }*/

  ]
})