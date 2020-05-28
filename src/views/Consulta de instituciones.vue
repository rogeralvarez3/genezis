<template>
<v-app>
  <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
    <v-card-title primary-title>
      <v-layout row>
        <v-flex xs4>Consultas</v-flex>
        <v-flex xs7>
          <v-autocomplete label="Buscar.." :items="llenarcliente" v-model="datosinstitucion.id">
          </v-autocomplete>
        </v-flex>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn class="ma-3" elevation-24 icon flat color="primary" v-on="on" @click="Seleccionar(datosinstitucion.id);">

              <v-icon dark>search</v-icon>
            </v-btn>
          </template>
          <span>Buscar</span>
        </v-tooltip>

      </v-layout>
    </v-card-title>
    <v-card-text>
      <input type="hidden" v-model="datosinstitucion.fecha">
      <v-tabs fixed-tabs v-model="tab">
        <v-tab>Datos generales</v-tab>
        <v-tab>Representantes 1</v-tab>
        <v-tab>Representantes 2</v-tab>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm5>
                    <v-text-field v-model="datosinstitucion.nombre" label="Nombre" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.dir" label="Dirección" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.ruc" label="Identificación" disabled></v-text-field>
                    <v-text-field v-model="datosinstitucion.telefono" label="Telefono" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.ocupacion" label="Ocupación" disabled></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm3>
                    <v-text-field v-model="datosinstitucion.pais" label="Nacionalidad" disabled>
                    </v-text-field> 
                    <v-text-field v-model="datosinstitucion.ciudad" label="Ciudad" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.sucursal" label="Sucursal" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.zona" label="Zona" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.correo" label="Correo" disabled>
                    </v-text-field>

                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field v-model="añossocio" label="Años de ser socio" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.inscrito" label="Inscrito" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.promotor" label="Promotor" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.circun" label="Circunscripción" disabled></v-text-field>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-form>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-card class="mx-auto" max-width="500">
                  <v-sheet class="pa-3 primary lighten-2">
                  </v-sheet>
                  <v-card-text>
                    <v-text-field v-model="datosinstitucion.rep1" label="Nombre" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.idenrep1" label="Identificación" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.dirrep1" label="Dirección" disabled></v-text-field>
                    <v-text-field v-model="datosinstitucion.telerep1" label="Telefono" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.cargorep1" label="Cargo" disabled></v-text-field>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-card class="mx-auto" max-width="500">
                  <v-sheet class="pa-3 primary lighten-2">
                  </v-sheet>
                  <v-card-text>
                    <v-text-field v-model="datosinstitucion.rep2" label="Nombre" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.idenrep2" label="Identificación" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.dirrep2" label="Dirección" disabled></v-text-field>
                    <v-text-field v-model="datosinstitucion.telerep2" label="Telefono" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosinstitucion.cargorep2" label="Cargo" disabled></v-text-field>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card-text>
  </v-card>
  
</v-app>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
       tab: null,
      colores: "primary",
      buscar: "",
      abrirmodal: false,
      añossocio:"",
      datosinstitucion: {
        id: 0,
        fecha: "",
        nombre: "",
        ruc: "",
        dir: "",
        telefono: "",
        fechana: "",
        edad: "",
        ocupacion: "",
        pais: "",
        ciudad: "",
        sucursal: "",
        zona: "",
        posicion: "",
        promotor: "",
        correo: "",
        rep1: "",
        idenrep1: "",
        dirrep1: "",
        telerep1: "",
        cargorep1: "",
        rep2: "",
        idenrep2: "",
        dirrep2: "",
        telerep2: "",
        retiro: "",
        fecharetiro: "",
        inscrito:"",

      },
      llenarcliente: [],

    };
  },
  methods: {
    //SELECCIONAR DE LA TABLA
    llenarbusqueda: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscardatos", {
          tabla: 'vinstitucion'
        })
        .then(resp => {
          mv.llenarcliente = JSON.parse(resp.data.d);
          //console.log(mv.llenarcliente);
        });
    },
    Seleccionar: function(id) {
      var mv = this;
      var selected;
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: 'vinstitucion',
          condicion: id
        }).then(resp => {
          if (resp.data.d === 'nada') {
            mv.$swal({
              type: 'info',
              text: 'Este socio tiene datos sin completar, Completelos primero',
              showConfirmButton: true
            });
          } else {
            mv.datosinstitucion = JSON.parse(resp.data.d)[0];
            mv.calcularedad(mv.datosinstitucion.fecha);
          }


        });

    },

    calcularedad: function(fecha) {
      var mv = this;
      var fechaNace = new Date(fecha);
      var fechaActual = new Date();
      var mes = fechaActual.getMonth();
      var dia = fechaActual.getDate();
      var año = fechaActual.getFullYear();
      fechaActual.setDate(dia);
      fechaActual.setMonth(mes);
      fechaActual.setFullYear(año);
      var edad = Math.floor(
        (fechaActual - fechaNace) / (1000 * 60 * 60 * 24) / 365
      );
      if (mv.tabla === 'fcliente') {
        mv.datosClientes.edad = edad;
      } else if (mv.tabla === 'finstitucion') {
        mv.datosinstitucion.edad = edad;
      } else if (mv.tabla === 'vcliente') {
        mv.añossocio = edad;
      }
      return edad;


    },


  },

  computed: {

  },
  mounted: function() {
    this.llenarbusqueda();
  }
};
</script>
