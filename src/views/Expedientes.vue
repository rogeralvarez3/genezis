<template>
  <v-app>
    <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
      <v-card-title class="grey lighten-4">
        <h3>Expedientes</h3>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout>
          <v-card width="40%">
            <v-card-title class="grey lighten-4 pt-1 pb-1">
              <div>
                <h4>Lista de socios</h4>
              </div>
              <v-spacer></v-spacer>
              <v-text-field
                name="name"
                label="Buscar cliente..."
                v-model="buscar"
                append-icon="search"
                :color="colores"
                dense
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-card-text pa-0>
              <v-data-table :items="expedientes" hide-headers>
                <template v-slot:items="props">
                  <tr
                    @click="selected={id:props.item.value,name:props.item.text,codcliente:props.item.codcliente}"
                    style="cursor:pointer"
                  >
                    <td>{{props.item.value}}</td>
                    <td>{{props.item.codcliente}}</td>
                    <td>{{props.item.text}}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>&nbsp;
          &nbsp;
          <v-card width="60%">
            <v-card-title class="grey lighten-4">
              <h4>Documentos de {{selected.name || '...'}}</h4>
              <v-spacer></v-spacer>
              <v-btn icon v-if="selected.name" @click="descargarZip()">
                <v-icon>save</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text pa-0>
              <v-expansion-panel focusable expand>
                <v-expansion-panel-content
                  class="teal lighten-4"
                  v-for="item in [{id:0,name:'Cuentas de ahorro'},{id:1,name:'Créditos'},{id:2,name:'Asesoría Legal'}]"
                  :key="item.id"
                >
                  <template v-slot:header>
                    <strong>{{item.name}}</strong>
                    <v-spacer></v-spacer>
                    <span>{{item.id===0?tablaahorro.length+' cuentas':tablacredito.length+' créditos'}}</span>
                  </template>
                  <div class="grey lighten-5 pa-2">
                    <v-expansion-panel v-if="item.id===0" focusable expand>
                      <v-expansion-panel-content v-for="(cuenta,i) in tablaahorro" :key="i">
                        <template v-slot:header>
                          <span>
                            {{cuenta.codcuenta}} - {{cuenta.tipocuenta}}
                            <span
                              class="blue--text"
                            >({{cuenta.documentos.split(',')[0].length>0?cuenta.documentos.split(',').length:0}} documentos)</span>
                            <v-btn
                              icon
                              flat
                              small
                              color="blue"
                              @click.stop="showGalería(cuenta.codcuenta,'ahorro')"
                            >
                              <v-icon small>collections</v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              flat
                              small
                              color="warning"
                              @click.stop="resetAccount('ahorro',cuenta.codcuenta)"
                            >
                              <v-icon small>refresh</v-icon>
                            </v-btn>
                          </span>
                        </template>
                        <div class="grey--text pa-2" v-if="cuenta.documentos.split(',').length>0">
                          <v-list>
                            <v-list-tile v-for="(doc,i) in tabladocahorro" :key="i">
                              <v-list-tile-content>
                                <v-list-tile-title
                                  :class="cuenta.documentos.split(',').includes(doc.value)?'purple--text':'grey--text'"
                                >{{doc.text}}</v-list-tile-title>
                              </v-list-tile-content>
                              <v-list-tile-action>
                                <v-layout row>
                                  <v-btn
                                    v-if="!cuenta.documentos.split(',').includes(doc.value)"
                                    icon
                                  >
                                    <v-icon color="grey lighten-1">visibility</v-icon>
                                  </v-btn>
                                  <v-btn
                                    v-if="cuenta.documentos.split(',').includes(doc.value)"
                                    icon
                                    @click="showImgPreview('ahorro',cuenta.codcuenta,doc.text)"
                                  >
                                    <v-icon color="primary">visibility</v-icon>
                                  </v-btn>&nbsp;
                                  <v-btn
                                    icon
                                    @click="imgToUpload.tipo='ahorro';imgToUpload.codigo=cuenta.codcuenta;imgToUpload.nombre=doc.text;$refs.inputImg.click()"
                                  >
                                    <v-icon color="success">camera_alt</v-icon>
                                  </v-btn>
                                </v-layout>
                              </v-list-tile-action>
                            </v-list-tile>
                          </v-list>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel v-if="item.id===1" elevation-0 focusable expand>
                      <v-expansion-panel-content v-for="(cr,i) in tablacredito" :key="i" pa-2>
                        <template v-slot:header>
                          <span>
                            {{cr.codcredito}} - {{cr.sector}}
                            <span
                              class="blue--text"
                            >({{cr.documentos.split(',')[0].length>0?cr.documentos.split(',').length:0}} documentos)</span>
                            <v-btn
                              icon
                              flat
                              small
                              color="blue"
                              @click.stop="showGalería(cr.codcredito,'créditos')"
                            >
                              <v-icon small>collections</v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              flat
                              small
                              color="warning"
                              @click.stop="resetAccount('créditos',cuenta.codcuenta)"
                            >
                              <v-icon small>refresh</v-icon>
                            </v-btn>
                          </span>
                        </template>
                        <div class="pa-2">
                          <v-list>
                            <v-list-tile v-for="(doc,i) in tabladoccredito" :key="i">
                              <v-list-tile-content>
                                <v-list-tile-title
                                  :class="cr.documentos.split(',').includes(doc.value)?'purple--text':'grey--text'"
                                >{{doc.text.toLowerCase()}}</v-list-tile-title>
                              </v-list-tile-content>
                              <v-list-tile-action>
                                <v-layout row>
                                  <v-btn v-if="!cr.documentos.split(',').includes(doc.value)" icon>
                                    <v-icon color="grey lighten-1">visibility</v-icon>
                                  </v-btn>
                                  <v-btn
                                    v-if="cr.documentos.split(',').includes(doc.value)"
                                    icon
                                    @click="showImgPreview('créditos',cr.codcredito,doc.text)"
                                  >
                                    <v-icon color="primary">visibility</v-icon>
                                  </v-btn>&nbsp;
                                  <v-btn
                                    icon
                                    @click="imgToUpload.tipo='créditos';imgToUpload.codigo=cr.codcredito;imgToUpload.nombre=doc.text;$refs.inputImg.click()"
                                  >
                                    <v-icon color="success">camera_alt</v-icon>
                                  </v-btn>
                                </v-layout>
                              </v-list-tile-action>
                            </v-list-tile>
                          </v-list>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel v-if="item.id===2" elevation-0 focusable expand>
                      <v-expansion-panel-content v-for="(cr,i) in tablacredito" :key="i" pa-2>
                        <template v-slot:header>
                          <span>
                            {{cr.codcredito}} - {{cr.sector}}
                            <span
                              class="blue--text"
                            >({{cr.documentos.split(',')[0].length>0?cr.documentos.split(',').length:0}} documentos)</span>
                            <v-btn
                              icon
                              flat
                              small
                              color="blue"
                              @click.stop="showGalería(cr.codcredito,'créditos')"
                            >
                              <v-icon small>collections</v-icon>
                            </v-btn>
                          </span>
                        </template>
                        <div class="pa-2">
                          <v-list>
                            <v-list-tile v-for="(doc,i) in tabladocasesoría" :key="i">
                              <v-list-tile-content>
                                <v-list-tile-title
                                  :class="cr.documentos.split(',').includes(doc.value)?'purple--text':'grey--text'"
                                >{{doc.text.toLowerCase()}}</v-list-tile-title>
                              </v-list-tile-content>
                              <v-list-tile-action>
                                <v-layout row>
                                  <v-btn v-if="!cr.documentos.split(',').includes(doc.value)" icon>
                                    <v-icon color="grey lighten-1">visibility</v-icon>
                                  </v-btn>
                                  <v-btn
                                    v-if="cr.documentos.split(',').includes(doc.value)"
                                    icon
                                    @click="showImgPreview('asesoría',cr.codcredito,doc.text)"
                                  >
                                    <v-icon color="primary">visibility</v-icon>
                                  </v-btn>&nbsp;
                                  <v-btn
                                    icon
                                    @click="imgToUpload.tipo='asesoría';imgToUpload.codigo=cr.codcredito;imgToUpload.nombre=doc.text;$refs.inputImg.click()"
                                  >
                                    <v-icon color="success">camera_alt</v-icon>
                                  </v-btn>
                                </v-layout>
                              </v-list-tile-action>
                            </v-list-tile>
                          </v-list>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card-text>
          </v-card>
        </v-layout>
      </v-card-text>
    </v-card>
    <input
      type="file"
      style="display:none"
      accept="application/pdf"
      ref="inputImg"
      @change="subirDocumento()"
      value
    />
    <v-dialog v-model="imgPreview.dlg" width="500">
      <v-card>
        <iframe style="min-width:500px;min-height:600px" :src="imgPreview.src"></iframe>
        <v-card-text>
          <h3>{{imgPreview.title}}</h3>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog width="600" v-model="dlgGalería">
      <v-card>
        <v-card-title>
          <h3>Documentos de {{selected.name}}</h3>&nbsp;
          <span class="blue--text">({{galería.descripción}})</span>
        </v-card-title>
        <v-card-text>
          <!--<v-carousel>
            <v-carousel-item v-for="(item,i) in galería.lista" :key="i" :src="item.src">
              <div
                style="text-shadow:0 0 5px white;padding:5px;font-size:16px;font-weight:bold"
              >{{item.title}}</div>
            </v-carousel-item>
          </v-carousel>-->
          <v-flex v-for="(item,i) in galería.lista" :key="i">
            <v-flex v-if="i==galería.current">
              <iframe style="min-width:570px;min-height:600px" :src="item.src" frameborder="0"></iframe>
              <br />
              <div style="color:white;background-color:dodgerblue;padding:5px;text-align:center">
                <h3>{{item.title}}&nbsp;</h3>
              </div>
            </v-flex>
          </v-flex>
          <v-layout>
            <v-spacer></v-spacer>
            <v-btn flat icon @click="galería.current>0?galería.current-=1:galería.current=0">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-btn
              flat
              icon
              @click="galería.current<galería.lista.length-1?galería.current+=1:galería.current=galería.lista.length-1"
            >
              <v-icon>chevron_right</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      open: [1, 2],
      selected: {
        id: 0,
        name: "",
        codcliente: "",
        ahorros: [],
        créditos: []
      },
      imgPreview: {
        title: "",
        src: "",
        dlg: false
      },
      imgToUpload: {
        tipo: "",
        codigo: "",
        nombre: ""
      },
      dlgGalería: false,
      galería: {
        lista: [],
        descripción: "",
        current: 0
      },
      tablaahorro: [],
      tablacredito: [],
      llenarcliente: [],
      tabladocahorro: [],
      tabladoccredito: [],
      tabladocasesoría: [],
      tab: null
    };
  },
  watch: {
    selected: function(value) {
      if (value.id > 0) {
        this.obtenerMovimientos(value.codcliente);
      }
    }
  },
  methods: {
    llenartabla: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "combos", {
          tabla: "fcliente"
        })
        .then(resp => {
          mv.llenarcliente = JSON.parse(resp.data.d);

          //console.log(mv.llenarcliente);
        });
    },
    llenardocumentos: function() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "cargardocumentos", {
          tipo: "AHORRO"
        })
        .then(resp => {
          mv.tabladocahorro = JSON.parse(resp.data.d);
        });
      axios
        .post(mv.$store.state.server + "cargardocumentos", {
          tipo: "CREDITO"
        })
        .then(resp => {
          mv.tabladoccredito = JSON.parse(resp.data.d);
        });
      axios
        .post(mv.$store.state.server + "cargardocumentos", {
          tipo: "ASESORIA"
        })
        .then(resp => {
          mv.tabladocasesoría = JSON.parse(resp.data.d);
        });
    },
    showGalería: function(cod, tipo) {
      var mv = this;
      mv.galería.current = 0;
      mv.galería.descripción = tipo + " -> " + cod;
      var path =
        mv.$store.state.server +
        "expedientes/" +
        mv.selected.codcliente +
        "/" +
        tipo +
        "/" +
        cod +
        "/";
      if (tipo === "ahorro") {
        var cuenta = mv.tablaahorro.filter(item => {
          return item.codcuenta === cod;
        });
        if (cuenta.length > 0) {
          mv.tabladocahorro.forEach(item => {
            if (cuenta[0].documentos.includes(item.value)) {
              mv.galería.lista.push({
                src: path + item.text + ".pdf",
                title: item.text
              });
            }
          });
        }
      } else {
        var cr = mv.tablacredito.filter(item => {
          return item.codcredito === cod;
        });
        if (cr.length > 0) {
          mv.tabladoccredito.forEach(item => {
            if (cr[0].documentos.includes(item.value)) {
              mv.galería.lista.push({
                src: path + item.text + ".pdf",
                title: item.text
              });
            }
          });
        }
      }
      mv.dlgGalería = true;
    },
    obtenerMovimientos: function(id) {
      var mv = this;
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: "vapertura",
          condicion: id
        })
        .then(r => {
          mv.tablaahorro = JSON.parse(r.data.d);
          //console.log(mv.tablaahorro)
        });
      axios
        .post(mv.$store.state.server + "buscarcampo", {
          tabla: "vdesembolso",
          condicion: id
        })
        .then(r => {
          mv.tablacredito = JSON.parse(r.data.d);
          //console.log(mv.tablacredito)
        });
    },
    subirDocumento: function() {
      var mv = this;

      var input = mv.$refs.inputImg;
      if (input.files && input.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", function(e) {
          var img = e.target.result;
          var params = {
            socio: mv.selected.codcliente,
            tipo: mv.imgToUpload.tipo,
            numeroDocumento: mv.imgToUpload.codigo,
            nombreDocumento: mv.imgToUpload.nombre,
            imagen: img
          };
          //  console.log(params);
          axios
            .post(mv.$store.state.server + "GuardarImagen", params)
            .then(r => {
              //console.log(r.data.d);
              if (r.data.d === "Guardado correctamente") {
                var socio = mv.selected.codcliente;
                mv.obtenerMovimientos(socio);
              }
            })
            .catch(error => {
              console.log(error);
            });
        });

        FR.readAsDataURL(input.files[0]);
        input.value = "";
      }
    },
    descargarZip() {
      var mv = this;
      axios
        .post(mv.$store.state.server + "zipFile", {
          idCliente: mv.selected.codcliente
        })
        .then(r => {
          axios
            .get(mv.mv.$store.state.server + r.data.d, {
              responseType: "blob"
            })
            .then(response => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", mv.selected.name + ".zip");
              document.body.appendChild(link);
              link.click();
            });
        });
    },
    showImgPreview: function(tipo, numero, nombre) {
      var fecha = new Date();
      fecha =
        fecha
          .getDate()
          .toString()
          .replace(/\//g, "") +
        fecha
          .getTime()
          .toString()
          .replace(/:/g, "");
      var path =
         "./expedientes/" +
        this.selected.codcliente +
        "/" +
        tipo +
        "/" +
        numero +
        "/" +
        nombre.toLowerCase() +
        ".pdf?" +
        fecha;
      this.imgPreview.src = path;
      this.imgPreview.title = nombre;
      this.imgPreview.dlg = true;
    },
    resetAccount: function(tipo, cuenta) {
      var mv = this;
      var url = mv.$store.state.server + "Update";
      if (tipo == "ahorro") {
        tipo = "aapertura";
      } else if (tipo == "créditos") {
        tipo = "cdesembolso";
      } else {
        return;
      }
      axios
        .post(url, {
          tabla: tipo,
          campos_valores: "documentos=''",
          condición:
            "codcliente='" +
            mv.selected.codcliente +
            "' and codcuenta='" +
            cuenta +
            "'"
        })
        .then(res => {
          console.log(res.data.d);
          if (res.data.d === "Guardado correctamente") {
            console.log(cuenta);
            if ((tipo = "ahorro")) {
              var i = mv.tablaahorro.findIndex(item => {
                return item.codcuenta === cuenta;
              });
              mv.$set(mv.tablaahorro[i], "documentos", "");
            } else if ((tipo = "créditos")) {
              var i = mv.tablacredito.findIndex(item => {
                return item.codcredito === cuenta;
              });
              mv.$set(mv.tablacredito[i], "documentos", "");
            }
          }
        });
    }
  },

  computed: {
    expedientes: function() {
      var mv = this;
      var result = [];
      //console.log('expedientes');

      result = mv.llenarcliente.filter(item => {
        var columnas = item.text + " " + item.codcliente;
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
    this.llenardocumentos();
  }
};
</script>
