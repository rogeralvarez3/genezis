<template>
  <v-app>
    <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
      <v-card-title primary-title>
        <v-layout row>
          <v-flex xs4>Mantenimiento de estudios</v-flex>
          <v-flex xs7>
            <v-autocomplete
              label="Buscar.."
              :items="llenarcliente"
              v-model="codigocliente"
            >
            </v-autocomplete>
          </v-flex>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                color="purple"
                flat
                v-on="on"
                @click="llenarestudios(codigocliente)"
              >
                <v-icon dark>search</v-icon>
              </v-btn>
            </template>
            <span>Buscar</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn fab dark color="indigo" flat v-on="on" @click="nuevo()">
                <v-icon dark>add_to_photos</v-icon>
              </v-btn>
            </template>
            <span>Agregar estudio</span>
          </v-tooltip>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="encabezados4"
          :items="tablaestudios"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.tipoestudio }}</td>
            <td>{{ props.item.nomestudio }}</td>
            <td>{{ props.item.temas }}</td>
            <td>{{ props.item.fechainicio }}</td>
            <td>{{ props.item.fechafinal }}</td>
            <td style="text-align: right;">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    small
                    flat
                    icon
                    v-on="on"
                    @click="Seleccionar(props.item.id)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Modificar el registro</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="red"
                    small
                    flat
                    icon
                    v-on="on"
                    @click.native="Eliminar(props.item.id)"
                  >
                    <v-icon>delete_forever</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar el registro</span>
              </v-tooltip>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-layout row>
      <input type="hidden" v-model="datosestudios.id" />
      <v-dialog v-model="abrirmodal" persistent max-width="600px">
        <v-card style="border-radius: 7px 7px 7px 7px;opacity:0.8;">
          <v-card-text>
            <v-select
              :items="comboestudio"
              v-model="datosestudios.tipoestudio"
              label="Estudio"
              required
              :rules="validar"
            ></v-select>
            <v-select
              :items="filtronomestudio"
              v-model="datosestudios.nomestudio"
              label="Nombre del estudio"
              required
              :rules="validar"
            ></v-select>
            <v-select
              :items="filtrotemas"
              v-model="datosestudios.temas"
              label="Temas"
              required
              :rules="validar"
            >
            </v-select>
            <v-text-field
              label="Fecha de inicio"
              v-model="datosestudios.fechainicio"
              :color="colores"
              type="date"
              required
              :rules="validar"
            ></v-text-field>
            <v-text-field
              label="Fecha de finalización"
              v-model="datosestudios.fechafinal"
              :color="colores"
              type="date"
              required
              :rules="validar"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" flat @click="guardar()">
              <v-icon>thumb_up</v-icon>&nbsp;Guardar
            </v-btn>
            <v-btn color="error" flat @click="cancelar()">
              <v-icon>cancel</v-icon>&nbsp;Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      colores: "primary",
      buscar: "",
      abrirmodal: false,
      validar: [v => !!v || "El campos es requerido"],
      llenarcliente: [],
      tablaestudios: [],
      encabezados4: [
        {
          value: "id",
          text: "Id"
        },
        {
          value: "tipoestudio",
          text: "Tipo de estudio"
        },
        {
          value: "nomestudio",
          text: "Nombre del estudio"
        },
        {
          value: "temas",
          text: "Temas"
        },
        {
          value: "fechainicio",
          text: "Fecha de inicio"
        },
        {
          value: "fechafinal",
          text: "Fecha final"
        },
        {
          text: "Editar"
        }
      ],
      datosestudios: {
        id: 0,
        idcliente: "",
        tipoestudio: "",
        nomestudio: "",
        temas: "",
        fechainicio: "",
        fechafinal: ""
      },
      codigocliente: "",
      comboestudio: [],
      combonomestudio: [],
      combotemas: []
    };
  },
  methods: {
    //boton nuevo
    nuevo: function() {
      var mv = this;
      mv.limpiar();
      mv.abrirmodal = true;
      mv.datosestudios.idcliente = mv.codigocliente;
    },
    //limpiar
    limpiar: function() {
      var mv = this;
      Object.keys(mv.datosestudios).forEach(function(key) {
        mv.datosestudios[key] = "";
      });
      mv.datosestudios.id = 0;
    },
    //boton cancelar
    cancelar: function() {
      var mv = this;
      mv.limpiar();
      mv.abrirmodal = false;
    },
    //metodo para llenar combos
    llenarCombo: function() {
      var mv = this;
      var tabla = "ftipoestudio";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.comboestudio = JSON.parse(resp.data.d);
        });
      tabla = "fnomestudio";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combonomestudio = JSON.parse(resp.data.d);
        });
      tabla = "ftemas";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combotemas = JSON.parse(resp.data.d);
        });
      tabla = "fcliente";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.llenarcliente = JSON.parse(resp.data.d);
          //console.log(mv.llenarcliente);
        });
    },
    //SELECCIONAR DE LA TABLA
    Seleccionar: function(id) {
      var mv = this;
      var selected;
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: "festudios",
          condicion: id
        })
        .then(resp => {
          if (resp.data.d === "nada") {
            swal.fire({
              type: "info",
              text: "Este socio no ha tendio ningun Estudio",
              showConfirmButton: true
            });
          } else {
            mv.datosestudios = JSON.parse(resp.data.d)[0];
          }
        });

      mv.abrirmodal = true;
    },
    //metodo para llenar cargos
    llenarestudios: function(id) {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: "vestudios",
          condicion: id
        })
        .then(resp => {
          if (resp.data.d === "nada") {
            mv.tablaestudios = [];
          } else {
            mv.tablaestudios = JSON.parse(resp.data.d);
          }
        });
    },
    //metodo para guardar
    guardar: function() {
      var mv = this;
      var campos = [];
      var valores = [];
      var validar = "";

      Object.keys(mv.datosestudios).forEach(function(key) {
        campos.push("`" + key + "`");
        valores.push("'" + mv.datosestudios[key] + "'");
        if (mv.datosestudios[key] === "") {
          validar = false;
        }
      });

      if (validar === false) {
        mv.$swal({
          type: "info",
          title: "Hay campos vacios,verifique",
          showConfirmButton: true
        });
      } else {
        mv.$swal({
          title: "Guardar",
          text: "Desea guardar el registro?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
          cancelButtonText: "No"
        }).then(result => {
          if (result.value) {
            axios
              .post(mv.$store.state.server + "Guardar2", {
                tabla: "festudios",
                campos: campos.toString(),
                valores: valores.toString()
              })
              .then(resp => {
                mv.$swal({
                  position: "top-end",
                  type: "success",
                  title: "Registro guardado",
                  showConfirmButton: false,
                  timer: 1500
                });
                mv.llenarestudios(mv.datosestudios.idcliente);
                mv.limpiar();
              });
          }
        });
      }
    },
    //Metodo de eliminar
    Eliminar: function(id) {
      var mv = this;
      mv.$swal({
        title: "Eliminar",
        text: "Desea eliminar el registro?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No"
      }).then(result => {
        if (result.value) {
          axios
            .post(mv.$store.state.server + "Eliminar", {
              tabla: "festudios",
              condicion: id.toString()
            })
            .then(resp => {
              mv.$swal({
                position: "top-end",
                type: "success",
                title: "Registro Eliminado",
                showConfirmButton: false,
                timer: 1500
              });
              mv.llenarestudios(mv.datosestudios.idcliente);
              mv.limpiar();
            });
        }
      });
    }
  },

  computed: {
    filtronomestudio: function() {
      var mv = this;
      var resul = mv.combonomestudio.filter(function(item) {
        return item.tipoestudio === mv.datosestudios.tipoestudio;
      });
      return resul;
    },
    filtrotemas: function() {
      var mv = this;
      var resul = mv.combotemas.filter(function(item) {
        return item.nomestudio === mv.datosestudios.nomestudio;
      });

      return resul;
    }
  },
  mounted: function() {
    this.llenarCombo();
  }
};
</script>
