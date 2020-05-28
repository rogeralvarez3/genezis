<template>
<v-app>
  <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
    <v-card-title primary-title>
      <v-layout row>
        <v-flex xs4>Mantenimiento de instituciones</v-flex>
        <v-flex xs7>
          <v-text-field name="name" label="Buscar institución..." v-model="buscar" append-icon="search" :color="colores"></v-text-field>
        </v-flex>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn  class="ma-3" elevation-24 icon flat color="primary"  v-on="on" @click="nuevo();">
             <v-icon>group_add</v-icon>
            </v-btn>
          </template>
          <span>Agregar nuevo cliente</span>
        </v-tooltip>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="encabezados2" :items="filtrartabla" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.ruc }}</td>
          <td>{{ props.item.telefono }}</td>
          <td>{{ props.item.dir}}</td>
          <td style="text-align: right;">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn color="primary"  small flat icon v-on="on" @click="Seleccionar(props.item.id);">
                    <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Modificar el registro</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn color="red"  small flat icon v-on="on" @click.native="Eliminar(props.item.id);">
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
    <input type="hidden" v-model="datosinstitucion.id">

    <v-dialog v-model="abrirmodal" persistent max-width="600px">
      <v-card style="border-radius: 7px 7px 7px 7px;opacity:0.8;">
        <v-card-text>
          <v-expansion-panel>
            <v-expansion-panel-content class="pink lighten-5">

              <template v-slot:actions>
                <v-icon :color="colores">done</v-icon>
              </template>
              <template v-slot:header>
                <div>Datos Basicos</div>
              </template>
              <v-card>
                <v-card-text>
                  <v-text-field label="Fecha de ingreso" v-model="datosinstitucion.fecha" :color="colores" type="date" required :rules="validar"></v-text-field>
                  <v-text-field label="Nombre" v-model="datosinstitucion.nombre" :color="colores" required :rules="validar" :counter="60"></v-text-field>
                  <v-text-field label="Ruc" v-model="datosinstitucion.ruc" :color="colores" required :rules="validar"></v-text-field>
                  <v-text-field v-model="datosinstitucion.dir" label="Dirección" :color="colores" required :rules="validar" :counter="100"></v-text-field>
                  <v-text-field label="Telefono" v-model="datosinstitucion.telefono" :color="colores" required :rules="validar"></v-text-field>
                  <v-text-field label="Fecha de constitución" v-model="datosinstitucion.fechana" :color="colores" type="date" @keyup="calcularedad(datosinstitucion.fechana);" required :rules="validar"></v-text-field>
                  <v-text-field label="Años" v-model="datosinstitucion.edad" :color="colores" type="number" required :rules="validar"></v-text-field>
                  <v-text-field label="Aque se dedica?" v-model="datosinstitucion.ocupacion" :color="colores" required :rules="validar" :counter="25"></v-text-field>
                  <v-select :items="comboretiro" v-model="datosinstitucion.retiro" label="Retirado" required :rules="validar"></v-select>
                  <v-text-field label="Fecha de retiro" v-model="datosinstitucion.fecharetiro" :color="colores" type="date" required :rules="validar"></v-text-field>
                  <v-select :items="comboinscrito" v-model="datosinstitucion.inscrito" label="Inscrito" required :rules="validar"></v-select>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="light-blue lighten-5">
              <template v-slot:actions>
                <v-icon :color="colores">done</v-icon>
              </template>
              <template v-slot:header>
                <div>Ubicación</div>
              </template>
              <v-card>
                <v-card-text>
                  <v-select :items="combopaises" v-model="datosinstitucion.pais" label="Nacionalidad" required :rules="validar" autocomplete></v-select>
                  <v-select :items="combociudad" v-model="datosinstitucion.ciudad" label="Ciudad" required :rules="validar" autocomplete></v-select>
                  <v-select :items="combosucursal" v-model="datosinstitucion.sucursal" label="sucursal" required :rules="validar"></v-select>
                  <v-select :items="filtrozona" v-model="datosinstitucion.zona" label="Zona\Barrio\Comunidad" required :rules="validar" autocomplete ></v-select>
                  <v-text-field v-model="datosinstitucion.correo" label="Correo" :color="colores" required :rules="validar" :counter="60"></v-text-field>
                  <v-select :items="filtropromotor" v-model="datosinstitucion.promotor" label="Promotor" required :rules="validar" autocomplete></v-select>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="teal lighten-5">
              <template v-slot:actions>
                <v-icon :color="colores">done</v-icon>
              </template>
              <template v-slot:header>
                <div>Representante 1</div>
              </template>
              <v-card>
                <v-card-text>

                  <v-text-field label="Nombre" v-model="datosinstitucion.rep1" :color="colores" required :rules="validar" :counter="60"></v-text-field>
                  <v-text-field label="Indentificacion" v-model="datosinstitucion.idenrep1" :color="colores" required :rules="validar"></v-text-field>
                  <v-text-field label="Dirección" v-model="datosinstitucion.dirrep1" :color="colores" required :rules="validar" :counter="60"></v-text-field>
                  <v-text-field label="Telefono" v-model="datosinstitucion.telerep1" :color="colores" required :rules="validar"></v-text-field>
                  <v-text-field label="Cargo" v-model="datosinstitucion.cargorep1" :color="colores" required :rules="validar" :counter="100"></v-text-field>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content class="teal lighten-4">
              <template v-slot:actions>
                <v-icon :color="colores">done</v-icon>
              </template>
              <template v-slot:header>
                <div>Representante 2</div>
              </template>
              <v-card>
                <v-card-text>
                  <v-text-field label="Nombre" v-model="datosinstitucion.rep2" :color="colores" required :rules="validar" :counter="60"></v-text-field>
                  <v-text-field label="Indentificacion" v-model="datosinstitucion.idenrep2" :color="colores" required :rules="validar"></v-text-field>
                  <v-text-field label="Dirección" v-model="datosinstitucion.dirrep2" :color="colores" required :rules="validar" :counter="60"></v-text-field>
                  <v-text-field label="Telefono" v-model="datosinstitucion.telerep2" :color="colores" required :rules="validar"></v-text-field>
                  <v-text-field label="Cargo" v-model="datosinstitucion.cargorep2" :color="colores" required :rules="validar" :counter="100"></v-text-field>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" flat @click="guardar();">
            <v-icon>thumb_up</v-icon>&nbsp;Guardar
          </v-btn>
          <v-btn color="error" flat @click="cancelar();">
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
;
export default {
  data() {
    return {
      colores: "primary",
      buscar: "",
      tablainstitucion: [],
      encabezados2: [{
        value: "id",
        text: "Id"
      }, {
        value: "nombre",
        text: "Nombre"
      }, {
        value: "ruc",
        text: "Ruc"
      }, {
        value: "telefono",
        text: "Telefono"
      }, {
        value: "dir",
        text: "Dirección"
      }, {
        text: "Editar"
      }],
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
        cargorep2: "",
        retiro: "",
        fecharetiro: "",
        inscrito:""
      },
      abrirmodal: false,
      combociudad: [],
      combopaises: [],
      combopromotor: [],
      combosucursal: [],
      combozona: [],
      comboretiro: [{
        value: "1",
        text: "SI"
      }, {
        value: "2",
        text: "NO"
      }],
      comboinscrito: [{
        value: "1",
        text: "SI"
      }, {
        value: "2",
        text: "NO"
      }],

      validar: [v => !!v || "El campos es requerido"]
    };
  },
  methods: {
    //boton nuevo
    nuevo: function() {
      var mv = this;
      mv.limpiar();
      mv.abrirmodal = true;
    },
    //limpiar
    limpiar: function() {
      var mv = this;
      Object.keys(mv.datosinstitucion).forEach(function(key) {
        mv.datosinstitucion[key] = "";
      });
      mv.datosinstitucion.id = 0;
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
      var tabla = "fpais";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combopaises = JSON.parse(resp.data.d);
        });
      tabla = "fciudad";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combociudad = JSON.parse(resp.data.d);
        });
      tabla = "fsucursal";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combosucursal = JSON.parse(resp.data.d);
        });
      tabla = "fzona";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combozona = JSON.parse(resp.data.d);
        });
      tabla = "fpromotor";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.combopromotor = JSON.parse(resp.data.d);
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
      selected = mv.tablainstitucion.filter(cl => {
        return cl.id === id;
      });
      if (selected.length > 0) {
        mv.datosinstitucion = JSON.parse(JSON.stringify(selected[0]));
      }
      mv.abrirmodal = true;
    },
    //FILTRAR TABLA
    llenartabla: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscardatos", {
          tabla: "finstitucion"
        })
        .then(resp => {
          mv.tablainstitucion = JSON.parse(resp.data.d);
        });
    },
    //metodo para guardar
    guardar: function() {
      var mv = this;
      var campos = [];
      var valores = [];
      var validar = "";

      Object.keys(mv.datosinstitucion).forEach(function(key) {
        campos.push("`" + key + "`");
        valores.push("'" + mv.datosinstitucion[key] + "'");
        if (mv.datosinstitucion[key] === "") {
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
              .post(mv.$store.state.server + "Guardar", {
                tabla: "finstitucion",
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

                mv.limpiar();
                mv.llenartabla();
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
              tabla: 'finstitucion',
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
              mv.limpiar();
              mv.llenartabla();
            });
        }
      });
    },
    //metodo para calcular edad
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
      if (mv.tabla === "fcliente") {
        mv.datosClientes.edad = edad;
      } else if (mv.tabla === "finstitucion") {
        mv.datosinstitucion.edad = edad;
      } else if (mv.tabla === "vcliente") {
        mv.añossocio = edad;
      }
      return edad;
    }

  },

  computed: {
    filtrozona: function() {
      var mv = this;
      var resul = mv.combozona.filter(function(item) {
        return item.sucursal === mv.datosinstitucion.sucursal;
      });

      return resul;
    },

    filtropromotor: function() {
      var mv = this;
      var resul = mv.combopromotor.filter(function(item) {
        return item.sucursal === mv.datosinstitucion.sucursal;
      });

      return resul;
    },
    filtrartabla: function() {
      //console.log('valor del campo buscar:',this.buscar)
      var mv = this;
      if (mv.buscar.length === 0) {
        return mv.tablainstitucion;
      }
      var result = mv.tablainstitucion.filter(item => {
        var columnas = item.nombre + " " + item.ruc;
        return (
          columnas
          .toString()
          .toLowerCase()
          .indexOf(mv.buscar.toLowerCase()) >= 0
        );
      });
      return result;
    }
  },
  mounted: function() {
    this.llenartabla();
    this.llenarCombo();
  }
};
</script>
