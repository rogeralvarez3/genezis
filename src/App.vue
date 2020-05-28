<template>
<v-app>
  <v-toolbar color="white" clipped-left app style="opacity:0.7;">  
    <v-btn @click.stop="drawer=true"  outlined fab flat class="hidden-lg-and-up">
      <v-icon>menu</v-icon>
    </v-btn> 
    <v-toolbar-title class="headline text-uppercase">
          <span>G</span>
          <span class="font-weight-light">ENEZIS</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        
  </v-toolbar>
  <v-navigation-drawer clipped flat app  v-model="drawer"  :elevation="24" style="opacity:0.7;">
    <v-list dense rounded>
      <v-list-tile v-for="item in menu" :key="item.texto" :to="item.texto">
        <v-list-tile-action>
          <v-icon :color="item.color">{{item.icono}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>{{item.texto}}</v-list-tile-title>
      </v-list-tile>

      <v-list-group prepend-icon="description" value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Reportes</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-group no-action sub-group value="true">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Listado de cliente</v-list-tile-title>
            </v-list-tile>
          </template>

          <v-list-tile v-for="admin in admins" :key="admin.texto" :to="admin.texto" @click="llamarreportes(admin.ruta);">
            <v-list-tile-title>{{admin.texto}}</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>{{admin.icono}}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>

        <v-list-group sub-group no-action>
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Generales</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile v-for="crud in cruds" :key="crud.texto" :to="crud.texto" @click="llamarreportes(crud.ruta);">
            <v-list-tile-title>{{crud.texto}}</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>{{crud.icono}}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <v-content>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      drawer: null,
       mini: true,
      menu: [
        
        {
          icono: "people",
          texto: "Cliente",
          color:"red"
        },
        {
          icono: "location_city",
          texto: "Institución",
          color:"orange darken-2"
        },
        {
          icono: "rowing",
          texto: "Cargos",
          color:"red"
        },
        {
          icono: "school",
          texto: "Estudios",
          color:"orange darken-2",
        },
        {
          icono: "folder_shared",
          texto: "Expedientes",
          color:"red"
        },
        {
icono:"file_copy",
texto:"Registro de escrituras",
color:"orange darken-2"
        },
        {
          icono: "search",
          texto: "Consulta_Cliente",
          color:"red"
        },
        {
          icono: "search",
          texto: "Consulta de instituciones",
          color:"orange darken-2",
        }
      ],
      admins: [{
          icono: "list",
          texto: "Por sucursal",
          ruta: "Rliscliente.aspx"
        },
        {
          icono: "list",
          texto: "Por Circunscripción",
          ruta: "Rlisclientecircun.aspx"
        },
        {
          icono: "list",
          texto: "Por Zona",
          ruta: "Rlisclientezona.aspx"
        }
      ],
      cruds: [{
          icono: "list",
          texto: "Delegados por sucursal",
          ruta: "Rlisdelegadosucursal.aspx"
        },
        {
          icono: "list",
          texto: "Delegados por circunscripción",
          ruta: "Rlisdelegadoscircun.aspx"
        },
        {
          icono: "list",
          texto: "Delegados por zona",
          ruta: "Rlisdelegadoszona.aspx"
        },
        {
          icono: "list",
          texto: "Cargos",
          ruta: ""
        },
        {
          icono: "list",
          texto: "Estudios",
          ruta: ""
        },
        {
          icono: "list",
          texto: "Inscritos y no inscritos",
          ruta: "Rlisinscrito.aspx"
        },

      ]
    };
  },
  methods: {
    llamarreportes: function(r) {
      var mv=this;
      URL = mv.$store.state.server2 + 'reportes/cliente/' + r
      window.open(URL, null, 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=1000,height=800,left=200,top=200');
      return false

    }
  }
};
</script>
<style>

.v-content {
  background-image: url(../public/img/fondo.jpg);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;

 
}

.theme--light.application  {
  background: none;
 
 
}
@media only screen and (max-width: 768px) {
  body,table tr td,table tr th {
    font-size: 10px;
  }

}
</style>