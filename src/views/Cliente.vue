<template>
  <v-app>
    <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
      <v-card-title primary-title class="pb-0 pt-1">
 
          <h3>  Mantenimiento de cliente</h3>
          <v-spacer></v-spacer>
            <v-text-field
              name="name"
              label="Buscar cliente..."
              v-model="buscar"
              append-icon="search"
              :color="colores"
              dense
              hide-details
            >
            </v-text-field>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                class="ma-3"
                elevation-24
                icon
                flat
                color="primary"
                v-on="on"
                @click="nuevo()"
              >
                <v-icon>group_add</v-icon>
              </v-btn>
            </template>
            <span>Agregar nuevo cliente</span>
          </v-tooltip>

      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="encabezados"
          :items="filtrartabla"
          class="elevation-1 dense"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.nombre }}</td>
            <td>{{ props.item.iden }}</td>
            <td>{{ props.item.telefono }}</td>

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
      <input type="hidden" v-model="datosClientes.id" />
      <v-dialog v-model="abrirmodal" persistent max-width="700px">
        <v-card style="border-radius: 7px 7px 7px 7px;opacity:0.8;">
          <v-card-text>
            <v-layout justify-center>
              <div class="subheading pt-3"></div>
              <v-avatar size="100">
                <v-img
                  id="foto"
                  :src="datosClientes.foto"
                  @click="seleccionarImagen()"
                ></v-img>
              </v-avatar>
              <input
                type="file"
                style="display:none"
                accept="image/*"
                ref="inputImg"
                id="inputImg"
                @change="alCambiarImagen()"
              />
            </v-layout>
            <v-expansion-panel>
              <v-expansion-panel-content class="red">
                <template v-slot:actions>
                  <v-icon :color="colores">done</v-icon>
                </template>
                <template v-slot:header>
                  <div>Datos Basicos</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-text-field
                      label="Fecha de ingreso"
                      v-model="datosClientes.fecha"
                      :color="colores"
                      type="date"
                      required
                      :rules="validar"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      label="Nombre"
                      v-model="datosClientes.nombre"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="60"
                    ></v-text-field>
                    <v-text-field
                      label="Identificación"
                      v-model="datosClientes.iden"
                      :color="colores"
                      required
                      :rules="validar"
                    ></v-text-field>
                    <v-text-field
                      v-model="datosClientes.dir"
                      label="Dirección"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="100"
                    ></v-text-field>
                    <v-text-field
                      label="Telefono"
                      v-model="datosClientes.telefono"
                      :color="colores"
                      required
                      :rules="validar"
                    ></v-text-field>
                    <v-text-field
                      label="Fecha de nacimiento"
                      v-model="datosClientes.fechana"
                      :color="colores"
                      type="date"
                      required
                      :rules="validar"
                      disabled
                    >
                    </v-text-field>
                    <v-text-field
                      label="Edad"
                      v-model="datosClientes.edad"
                      @click="calcularedad()"
                      :color="colores"
                      type="number"
                      required
                      :rules="validar"
                    ></v-text-field>
                    <v-select
                      :items="combosexo"
                      v-model="datosClientes.sexo"
                      label="Sexo"
                      required
                      :rules="validar"
                      v-show="nojuridico"
                    >
                    </v-select>
                    <v-select
                      :items="comboescolaridad"
                      v-model="datosClientes.escolaridad"
                      label="Escolaridad"
                      required
                      :rules="validar"
                      autocomplete
                      v-show="nojuridico"
                    ></v-select>
                    <v-select
                      :items="comboprofesion"
                      v-model="datosClientes.profesion"
                      label="Profesión"
                      required
                      :rules="validar"
                      autocomplete
                      v-show="nojuridico"
                    ></v-select>
                    <v-text-field
                      label="Ocupación"
                      v-model="datosClientes.ocupacion"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="25"
                    ></v-text-field>
                    <v-text-field
                      label="Número de hijos"
                      v-model="datosClientes.hijos"
                      :color="colores"
                      type="number"
                      required
                      :rules="validar"
                      v-show="nojuridico"
                    ></v-text-field>
                    <v-select
                      :items="combocivil"
                      v-model="datosClientes.estadocivil"
                      label="Estado civil"
                      required
                      :rules="validar"
                      v-show="nojuridico"
                    ></v-select>
                    <v-text-field
                      label="ingresos mensuales"
                      v-model="datosClientes.ingresosm"
                      :color="colores"
                      required
                      :rules="validar"
                      type="number"
                    ></v-text-field>
                     <v-text-field
                      label="Procedencia del ingreso"
                      v-model="datosClientes.precedenciaingreso"
                      :color="colores"
                      required
                      :rules="validar"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content class="orange darken-2">
                <template v-slot:actions>
                  <v-icon :color="colores">done</v-icon>
                </template>
                <template v-slot:header>
                  <div>Ubicación</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-select
                      :items="combopaises"
                      v-model="datosClientes.nacionalidad"
                      label="Nacionalidad"
                      required
                      :rules="validar"
                      autocomplete
                    ></v-select>
                    <v-select
                      :items="combociudad"
                      v-model="datosClientes.ciudad"
                      label="Ciudad"
                      required
                      :rules="validar"
                      autocomplete
                    ></v-select>
                    <v-select
                      :items="combosucursal"
                      v-model="datosClientes.sucursal"
                      label="sucursal"
                      required
                      :rules="validar"
                      autocomplete
                    ></v-select>
                    <v-select
                      :items="filtrozona"
                      v-model="datosClientes.zona"
                      label="Zona\Barrio\Comunidad"
                      required
                      :rules="validar"
                      autocomplete
                    ></v-select>
                    <v-text-field
                      v-model="datosClientes.correo"
                      label="Correo"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="60"
                    ></v-text-field>
                    <v-text-field
                      label="Lugar de trabajo"
                      v-model="datosClientes.lugartrabajo"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="60"
                      v-show="nojuridico"
                    ></v-text-field>
                    <v-text-field
                      label="Dirección del trabajo"
                      v-model="datosClientes.dirtrabajo"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="100"
                      v-show="nojuridico"
                    ></v-text-field>
                    <v-text-field
                      label="Telefono del trabajo"
                      v-model="datosClientes.teletrabajo"
                      :color="colores"
                      required
                      :rules="validar"
                      v-show="nojuridico"
                    ></v-text-field>
                     
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content class="red" v-show="nojuridico">
                <template v-slot:actions>
                  <v-icon :color="colores">done</v-icon>
                </template>
                <template v-slot:header>
                  <div>Referencias</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-text-field
                      label="Nombre del conyugue"
                      v-model="datosClientes.conyugue"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="60"
                    ></v-text-field>
                    <v-text-field
                      label="Telefono del conyugue"
                      v-model="datosClientes.teleconyugue"
                      :color="colores"
                      required
                      :rules="validar"
                    ></v-text-field>
                    <v-text-field
                      label="Referente"
                      v-model="datosClientes.referente"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="60"
                    ></v-text-field>
                    <v-text-field
                      label="Telefono del referente"
                      v-model="datosClientes.telereferente"
                      :color="colores"
                      required
                      :rules="validar"
                    ></v-text-field>
                    <v-text-field
                      label="Dirección del referente"
                      v-model="datosClientes.dirreferente"
                      :color="colores"
                      required
                      :rules="validar"
                      :counter="100"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content
                class="orange darken-2"
                v-show="reprsentantes"
              >
                <template v-slot:actions>
                  <v-icon :color="colores">done</v-icon>
                </template>
                <template v-slot:header>
                  <div>Representantes</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-tabs
                      fixed-tabs
                      color="light-green lighten-1"
                      v-model="tab"
                    >
                      <v-tab>
                        Representate 1
                      </v-tab>
                      <v-tab>
                        Representante 2
                      </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item>
                        <v-card flat color="basil">
                          <v-card-text>
                            <v-text-field
                              label="Nombre"
                              v-model="datosClientes.rep1"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="60"
                            ></v-text-field>
                            <v-text-field
                              label="Identificación"
                              v-model="datosClientes.idenrep1"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="17"
                            ></v-text-field>
                            <v-text-field
                              label="Dirección"
                              v-model="datosClientes.dirrep1"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="200"
                            ></v-text-field>
                            <v-text-field
                              label="Telefono"
                              v-model="datosClientes.telerep1"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="9"
                            ></v-text-field>
                            <v-text-field
                              label="Cargo"
                              v-model="datosClientes.cargorep1"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="30"
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat color="basil">
                          <v-card-text>
                            <v-text-field
                              label="Nombre"
                              v-model="datosClientes.rep2"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="60"
                            ></v-text-field>
                            <v-text-field
                              label="Identificación"
                              v-model="datosClientes.idenrep2"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="17"
                            ></v-text-field>
                            <v-text-field
                              label="Dirección"
                              v-model="datosClientes.dirrep2"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="200"
                            ></v-text-field>
                            <v-text-field
                              label="Telefono"
                              v-model="datosClientes.telerep2"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="9"
                            ></v-text-field>
                            <v-text-field
                              label="Cargo"
                              v-model="datosClientes.cargorep2"
                              :color="colores"
                              required
                              :rules="validar"
                              :counter="30"
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content class="orange darken-2">
                <template v-slot:actions>
                  <v-icon :color="colores">done</v-icon>
                </template>
                <template v-slot:header>
                  <div>Otros datos</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-select
                      :items="filtropromotor"
                      v-model="datosClientes.promotor"
                      label="Promotor"
                      required
                      :rules="validar"
                      autocomplete
                    ></v-select>
                    <v-select
                      :items="comboinscrito"
                      v-model="datosClientes.inscrito"
                      label="Inscrito"
                      required
                      :rules="validar"
                    ></v-select>
                    <v-select
                      :items="comboesdelegado"
                      v-model="datosClientes.esdelegado"
                      label="Es delegado"
                      required
                      :rules="validar"
                    ></v-select>
                    <v-text-field
                      label="Fecha de nombramiento"
                      v-model="datosClientes.fechadelegado"
                      :color="colores"
                      type="date"
                      required
                      :rules="validar"
                    ></v-text-field>
                    <v-select
                      :items="comboretiro"
                      v-model="datosClientes.retiro"
                      label="Retirado"
                      required
                      :rules="validar"
                    ></v-select>
                    <v-text-field
                      label="Fecha de retiro"
                      v-model="datosClientes.fecharetiro"
                      :color="colores"
                      type="date"
                      required
                      :rules="validar"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content class="red">
                <template v-slot:actions>
                  <v-icon :color="colores">done</v-icon>
                </template>
                <template v-slot:header>
                  <div>Firma</div>
                </template>
                <v-card>
                  <v-card-text>
                    <v-layout row wrap justify-center>
                      <v-flex xs6>
                        <v-img
                          :src="datosClientes.firma"
                          style="border:1px solid black;cursor:pointer"
                          @click="seleccionarfirma()"
                          title="Firma"
                        >
                          <div class="fill-height bottom-gradient"></div>
                        </v-img>
                        <input
                          type="file"
                          style="display:none"
                          accept="image/*"
                          ref="inputImg2"
                          id="inputImg2"
                          @change="alCambiarImagen2()"
                        />
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-checkbox
              label="Cliente es juridico"
              v-model="datosClientes.esjuridico"
              @change="juridico()"
            ></v-checkbox>
            <v-spacer></v-spacer>

            <v-btn color="orange darken-2" flat @click="guardar()">
              <v-icon>thumb_up</v-icon>&nbsp;Guardar
            </v-btn>
            <v-btn color="red" flat @click="cancelar()">
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
      tab: null,

      tablacliente: [],
      encabezados: [
        {
          value: "id",
          text: "Id"
        },
        {
          value: "nombre",
          text: "Nombre"
        },
        {
          value: "iden",
          text: "Identificación"
        },
        {
          value: "telefono",
          text: "Telefono"
        },

        {
          text: "Editar"
        }
      ],
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
        inscrito: "",
        foto: "../img/avatar.png",
        retiro: "",
        fecharetiro: "01-01-1900",
        fechadelegado: "01-01-1900",
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
        esjuridico: false,
        firma: "../img/avatar.png",
        ingresosm:"",
        procedenciaingreso:""
      },
      reprsentantes: false,
      nojuridico: true,
      combociudad: [],
      comboescolaridad: [],
      combopaises: [],
      combosucursal: [],
      combozona: [],
      comboprofesion: [],
      combopromotor: [],
      combosexo: [
        {
          value: "1",
          text: "MASCULINO"
        },
        {
          value: "2",
          text: "FEMENINO"
        }
      ],
      comboretiro: [
        {
          value: "1",
          text: "SI"
        },
        {
          value: "2",
          text: "NO"
        }
      ],
      comboesdelegado: [
        {
          value: "1",
          text: "SI"
        },
        {
          value: "2",
          text: "NO"
        }
      ],
      comboinscrito: [
        {
          value: "1",
          text: "SI"
        },
        {
          value: "2",
          text: "NO"
        }
      ],
      combocivil: [
        {
          value: "1",
          text: "SOLTERO(@)"
        },
        {
          value: "2",
          text: "CASADO(@)"
        },
        {
          value: "3",
          text: "UNION LIBRE"
        }
      ],
      validar: [v => !!v || "El campos es requerido"]
    };
  },

  methods: {
    juridico: function() {
      var mv = this;
      if (
        mv.datosClientes.esjuridico === true ||
        mv.datosClientes.esjuridico == "True"
      ) {
        mv.nojuridico = false;
        mv.reprsentantes = true;
      } else {
        mv.nojuridico = true;
        mv.reprsentantes = false;
      }
    },
    //boton nuevo
    nuevo: function() {
      var mv = this;
      mv.limpiar();
      mv.abrirmodal = true;
      mv.datosClientes.id = 0;
      mv.datosClientes.sexo = 0;
      mv.datosClientes.escolaridad = 0;
      mv.datosClientes.profesion = 0;
      mv.datosClientes.hijos = 0;
      mv.datosClientes.estadocivil = 0;
      mv.nojuridico = true;
      mv.reprsentantes = false;
    },
    //limpiar
    limpiar: function() {
      var mv = this;
      Object.keys(mv.datosClientes).forEach(function(key) {
        if (key === "foto") {
          return;
        }
        if (key === "fecha") {
          return;
        }
        mv.datosClientes[key] = "";
      });
      mv.datosClientes.id = 0;
      if (mv.datosClientes.fecharetiro == "") {
        mv.datosClientes.fecharetiro = "1900-01-01";
      }
      if (mv.datosClientes.fechadelegado == "") {
        mv.datosClientes.fechadelegado = "1900-01-01";
      }
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

      tabla = "fescolaridad";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.comboescolaridad = JSON.parse(resp.data.d);
        });
      tabla = "fprofesion";
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: tabla
        })
        .then(resp => {
          mv.comboprofesion = JSON.parse(resp.data.d);
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
      debugger
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
      selected = mv.tablacliente.filter(cl => {
        return cl.id === id;
      });
      if (selected.length > 0) {
        mv.datosClientes = JSON.parse(JSON.stringify(selected[0]));
      }
      mv.abrirmodal = true;
      mv.juridico();
    },
    //FILTRAR TABLA
    llenartabla: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscardatos", {
          tabla: "fcliente"
        })
        .then(resp => {
          mv.tablacliente = JSON.parse(resp.data.d);
        });
    },
    //metodo para guardar
    guardar: function() {
      var mv = this;
      var campos = [];
      var valores = [];
      var validar = "";

      /* Object.keys(mv.datosClientes).forEach(function(key) {
        campos.push("`" + key + "`");
        valores.push("'" + mv.datosClientes[key] + "'");
        if (mv.datosClientes[key] === "") {
          validar = false;
        }
      });*/
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
              tabla: "fcliente",
              datos: JSON.stringify(mv.datosClientes)
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
              tabla: "fcliente",
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
    calcularedad: function() {
      var mv = this;
      var caracter = mv.datosClientes.iden.length;
      if (caracter == 14) {
        var cedula = mv.datosClientes.iden.substr(3, 6);
        var años = cedula.substr(4, 2);
        if (años <= 99 && años >= 40) {
          años = "19" + años;
        } else {
          años = "20" + años;
        }
        var dias = cedula.substr(0, 2);
        var meses = cedula.substr(2, 2);
        var fecha = años + "-" + meses + "-" + dias;
        mv.datosClientes.fechana = fecha;
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

        mv.datosClientes.edad = edad;

        return edad;
      } else {
        mv.$swal({
          type: "error",
          title: "Oops...",
          text: "Número de Cedula es incorrecta!"
        });
      }
    },
    seleccionarImagen: function() {
      //console.log('aquí seleccionas la imagen');
      this.$refs.inputImg.click();
    },
    alCambiarImagen: function() {
      //console.log('se ha cambiado la imagen')
      var e = document.getElementById("inputImg");
      var mv = this;
      if (e.files && e.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", function(e) {
          //document.getElementById("foto").src = e.target.result;
          var img = new Image();

          img.addEventListener("load", function() {
            var canvas = document.createElement("canvas");
            canvas.width = 600;
            canvas.height = 480;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 600, 480);
            mv.datosClientes.foto = ctx.canvas.toDataURL("image/jpeg", 0.7);
            //console.log(mv.datosClientes.foto);
          });
          img.src = e.target.result;

          //console.log(mv.datosCliente.foto)
        });

        FR.readAsDataURL(e.files[0]);
      }
    },
    elemExist: function(el, arr, key) {
      var result = false;
      if (!arr || arr.length === 0) {
        return false;
      }
      arr.forEach(e => {
        if (e[key].includes(el)) {
          result = true;
        }
      });
      return result;
    },
    buscarfecha: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: "fechatrabajo"
        })
        .then(resp => {
          mv.datosClientes.fecha = JSON.parse(resp.data.d)[0].fechaactual;
        });
    },
    seleccionarfirma: function() {
      //console.log('aquí seleccionas la imagen');
      this.$refs.inputImg2.click();
    },
    alCambiarImagen2: function() {
      //console.log('se ha cambiado la imagen')
      var e = document.getElementById("inputImg2");
      var mv = this;
      if (e.files && e.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", function(e) {
          //document.getElementById("foto").src = e.target.result;
          var img = new Image();

          img.addEventListener("load", function() {
            var canvas = document.createElement("canvas");
            canvas.width = 600;
            canvas.height = 480;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 600, 480);
            mv.datosClientes.firma = ctx.canvas.toDataURL("image/jpeg", 0.7);

            //console.log(mv.datosClientes.foto);
          });
          img.src = e.target.result;

          //console.log(mv.datosCliente.foto)
        });

        FR.readAsDataURL(e.files[0]);
      }
    }
  },

  computed: {
    filtrozona: function() {
      var mv = this;
      var resul = mv.combozona.filter(function(item) {
        return item.sucursal === mv.datosClientes.sucursal;
      });

      return resul;
    },
    filtropromotor: function() {
      var mv = this;
      var resul = mv.combopromotor.filter(function(item) {
        return item.sucursal === mv.datosClientes.sucursal;
      });

      return resul;
    },
    filtrartabla: function() {
      //console.log('valor del campo buscar:',this.buscar)
      var mv = this;
      if (mv.buscar.length === 0) {
        return mv.tablacliente;
      }
      var result = mv.tablacliente.filter(item => {
        var columnas = item.nombre + " " + item.iden;
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
    this.buscarfecha();
  }
};

Array.prototype.unique = (function(a) {
  return function() {
    return this.filter(a);
  };
})(function(a, b, c) {
  return c.indexOf(a, b + 1) < 0;
});
</script>
