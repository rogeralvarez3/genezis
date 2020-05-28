<template>
<v-app>
  <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
     <input type="hidden" v-model="datosClientes.fecha">
    <v-card-title primary-title>
      <v-layout row>
        <v-flex xs4>Consultas</v-flex>
        <v-flex xs7>
          <v-autocomplete label="Buscar.." :items="llenarcliente" v-model="datosClientes.id">
          </v-autocomplete>
        </v-flex>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn class="ma-3" elevation-24 icon flat color="primary" v-on="on" @click="Seleccionar(datosClientes.id);llenarcargos(datosClientes.id);obtenerEstudios(datosClientes.id);">
              <v-icon>search</v-icon>
            </v-btn>
          </template>
          <span>Buscar</span>
        </v-tooltip>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <v-tabs fixed-tabs v-model="tab">
        <v-tab>Datos generales</v-tab>
        <v-tab>Cargos</v-tab>
        <v-tab>Estudios</v-tab>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm5>
                    <v-text-field v-model="datosClientes.nombre" label="Nombre" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.dir" label="Dirección" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.iden" label="Identificación" disabled></v-text-field>
                    <v-text-field v-model="datosClientes.telefono" label="Telefono" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.profesion" label="Profesión" disabled></v-text-field>
                    <v-text-field v-model="datosClientes.ocupacion" label="Ocupación" disabled></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm3>
                    <v-text-field v-model="datosClientes.pais" label="Nacionalidad" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.ciudad" label="Ciudad" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.sucursal" label="Sucursal" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.zona" label="Zona" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.correo" label="Correo" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.circun" label="Circunscripción" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field v-model="datosClientes.referente" label="Referente" disabled></v-text-field>
                    <v-text-field v-model="datosClientes.telereferente" label="Telefono del referente" disabled></v-text-field>
                    <v-text-field v-model="añossocio" label="Años de ser socio" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.esdelegado" label="Es delegado" disabled></v-text-field>
                    <v-text-field v-model="datosClientes.inscrito" label="Inscrito" disabled>
                    </v-text-field>
                    <v-text-field v-model="datosClientes.promotor" label="Promotor" disabled>
                    </v-text-field>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-form>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-data-table dense :headers="encabezados3" :items="tablacargos" class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.comite }}</td>
                    <td>{{ props.item.cargo }}</td>
                    <td>{{ props.item.fechainicial }}</td>
                    <td>{{ props.item.fechafinal}}</td>
                    <td>{{ props.item.actual}}</td>

                  </template>

                </v-data-table>
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
                    <v-treeview :items="treeEstudios">

                    </v-treeview>
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
      añossocio:"",
      buscar: "",
      abrirmodal: false,
      datosClientes: {
        id: 0,
        fecha: "",
        nombre: "",
        iden: "",
        telefono: "",
        fechana: "",
        edad: "",
        sexo: "",
        escolaridad: "",
        profesion: "",
        ocupacion: "",
        hijos: "",
        estadocivil: "",
        nacionalidad: "",
        ciudad: "",
        sucursal: "",
        zona: "",
        correo: "",
        lugartrabajo: "",
        dirtrabajo: "",
        teletrabajo: "",
        conyugue: "",
        teleconyugue: "",
        referente: "",
        telereferente: "",
        dirreferente: "",
        promotor: "",
        posicion: "",
        circun: "",
        inscrito: "",
        foto: '../img/avatar.png',
        retiro: "",
        fecharetiro: "",
        fechadelegado: ""
      },
      llenarcliente: [],
      tablacargos: [],
      treeEstudios: [],
      encabezados3: [{
        value: "id",
        text: "Id"
      }, {
        value: "comite",
        text: "Comite"
      }, {
        value: "cargo",
        text: "Cargo"
      }, {
        value: "fechainicial",
        text: "Fecha de nombramiento"
      }, {
        value: "fechafinal",
        text: "Fecha de culminación"
      }, {
        value: "actual",
        text: "Cargo es actual?"
      }, ],
    };
  },
  methods: {
    //SELECCIONAR DE LA TABLA
    llenarbusqueda: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: 'fcliente'
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
          tabla: 'vcliente',
          condicion: id
        }).then(resp => {
          if (resp.data.d === 'nada') {
            mv.$swal({
              type: 'info',
              text: 'Este socio tiene datos sin completar, Completelos primero',
              showConfirmButton: true
            });
          } else {
            mv.datosClientes = JSON.parse(resp.data.d)[0];
            mv.calcularedad(mv.datosClientes.fecha);
          }


        });

    },
    //metodo para llenar cargos
    llenarcargos: function(id) {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: 'vcargos',
          condicion: id
        }).then(resp => {
          if (resp.data.d === "nada") {
            mv.tablacargos = [];
          } else {
            mv.tablacargos = JSON.parse(resp.data.d);
          }

        });

    },
    obtenerEstudios: function(idcliente) {
      var mv = this;

      axios.post(mv.$store.state.server + "metodoestudios", {
        idcliente: idcliente
      }).then(resp => {
        var d = JSON.parse(resp.data.d);
        var tree = [];
        var n1 = [],
          n2 = [];
        if (d.length > 0) {
          d.forEach(item => {
            n1.push(item["tipoestudio"]);
            n2.push(item["nomestudio"] + "~" + item["tipoestudio"]);
          });
          n1 = n1.unique();
          n1.forEach(el => {
            var children = [];
            n2.forEach(subEl => {
              if (subEl.split("~")[1] === el) {
                var subChild = [];
                d.forEach(n3 => {
                  if (n3["nomestudio"] === subEl.split("~")[0]) {
                    subChild.push({
                      name: n3["temas"]
                    });
                  }
                });
                children.push({
                  name: subEl.split("~")[0],
                  children: subChild
                });
              }
            });
            tree.push({
              name: el,
              children: children
            });
          });

        }
        //console.log(tree)
        mv.treeEstudios = tree;
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
