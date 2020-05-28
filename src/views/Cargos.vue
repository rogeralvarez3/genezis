<template>
  <v-app>
    <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
      <v-card-title primary-title>
        <v-layout row>
          <v-flex xs4>Mantenimiento de cargos</v-flex>
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
                @click="llenarcargos(codigocliente)"
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
            <span>Agregar cargo</span>
          </v-tooltip>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="encabezados3"
          :items="tablacargos"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.comite }}</td>
            <td>{{ props.item.cargo }}</td>
            <td>{{ props.item.fechainicial }}</td>
            <td>{{ props.item.fechafinal }}</td>
            <td>{{ props.item.actual }}</td>
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
      <input type="hidden" v-model="datoscargos.id" />

      <v-dialog v-model="abrirmodal" persistent max-width="600px">
        <v-card style="border-radius: 7px 7px 7px 7px;opacity:0.8;">
          <v-card-text>
            <v-select
              :items="combocomite"
              v-model="datoscargos.comite"
              label="Comite"
              required
              :rules="validar"
            ></v-select>
            <v-select
              :items="combocargo"
              v-model="datoscargos.cargo"
              label="Cargo"
              required
              :rules="validar"
            ></v-select>
            <v-text-field
              label="Fecha de nombramiento"
              v-model="datoscargos.fechainicial"
              :color="colores"
              type="date"
              required
              :rules="validar"
            ></v-text-field>
            <v-text-field
              label="Fecha de culminación"
              v-model="datoscargos.fechafinal"
              :color="colores"
              type="date"
              required
              :rules="validar"
            ></v-text-field>
            <v-select
              :items="comboactual"
              v-model="datoscargos.actual"
              label="Cargo actual?"
              required
              :rules="validar"
            ></v-select>
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
      tablacargos: [],
      encabezados3: [
        {
          value: "id",
          text: "Id"
        },
        {
          value: "comite",
          text: "Comite"
        },
        {
          value: "cargo",
          text: "Cargo"
        },
        {
          value: "fechainicial",
          text: "Fecha de nombramiento"
        },
        {
          value: "fechafinal",
          text: "Fecha de culminación"
        },
        {
          value: "actual",
          text: "Cargo es actual?"
        },
        {
          text: "Editar"
        }
      ],
      datoscargos: {
        id: 0,
        idcliente: "",
        comite: "",
        cargo: "",
        fechainicial: "",
        fechafinal: "",
        actual: ""
      },
      codigocliente: "",
      combocargo: [],
      combocomite: [],
      llenarcliente: [],
      comboactual: [
        {
          value: "SI",
          text: "SI"
        },
        {
          value: "NO",
          text: "NO"
        }
      ]
    };
  },
  methods: {
    //boton nuevo
    nuevo: function() {
      var mv = this;
      mv.limpiar();
      mv.abrirmodal = true;
      mv.datoscargos.idcliente = mv.codigocliente;
    },
    //limpiar
    limpiar: function() {
      var mv = this;
      Object.keys(mv.datoscargos).forEach(function(key) {
        mv.datoscargos[key] = "";
      });
      mv.datoscargos.id = 0;
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
      var tabla = "fcargo";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combocargo = JSON.parse(resp.data.d);
        });
      tabla = "fcomites";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combocomite = JSON.parse(resp.data.d);
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
          tabla: "fcargos",
          condicion: id
        })
        .then(resp => {
          if (resp.data.d === "nada") {
            mv.$swal({
              type: "info",
              text: "Este socio no ha tendio ningun cargo",
              showConfirmButton: true
            });
          } else {
            mv.datoscargos = JSON.parse(resp.data.d)[0];
          }
        });

      mv.abrirmodal = true;
    },
    //metodo para llenar cargos
    llenarcargos: function(id) {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: "vcargos",
          condicion: id
        })
        .then(resp => {
          if (resp.data.d === "nada") {
            mv.tablacargos = [];
          } else {
            mv.tablacargos = JSON.parse(resp.data.d);
          }
        });
    },
    //metodo para guardar
    guardar: function() {
      var mv = this;
      var campos = [];
      var valores = [];
      var validar = "";

      Object.keys(mv.datoscargos).forEach(function(key) {
        campos.push("`" + key + "`");
        valores.push("'" + mv.datoscargos[key] + "'");
        if (mv.datoscargos[key] === "") {
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
                tabla: "fcargos",
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
                mv.llenarcargos(mv.datoscargos.idcliente);
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
              tabla: "fcargos",
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
              mv.llenarcargos(mv.datoscargos.idcliente);
              mv.limpiar();
            });
        }
      });
    }
  },

  computed: {},
  mounted: function() {
    this.llenarCombo();
  }
};
</script>
