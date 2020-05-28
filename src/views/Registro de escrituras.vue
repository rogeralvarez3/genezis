<template>
  <v-app>
    <v-toolbar :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
      <v-toolbar-title v-text="título"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{on}">
          <v-btn v-on="on" icon dark color="success" @click="editMode=true;selected=clonar(nuevo);"><v-icon>add</v-icon></v-btn>
        </template>
        <span>Agregar escritura</span>
      </v-tooltip>
      <v-text-field prepend-inner-icon="search" v-model="buscar"></v-text-field>
    </v-toolbar>
     
    <v-layout style="margin-top:5px" >
      <v-card :elevation="24" style="border-radius: 7px 7px 7px 7px;opacity:0.7">
      <div class="pa-2">
        <table>
          <tr>
            <th v-for="(col,i) in columnas" :key="i" class="text-left">{{col}}</th>
            <th></th>
          </tr>
          <tr v-for="(fila,i) in tablaFiltrada" :key="i" @click="selected=clonar(fila)" :class="selected.id===fila.id?'selected':''">
            <td v-for="key in columnas" :key="i+'-'+key">{{fila[key.toLowerCase()]}}</td>
            <td>
              <v-layout v-if="selected.id===fila.id">
                <v-tooltip top>
                  <template v-slot:activator="{on}">
                    <v-btn v-on="on" icon small dark @click="tryDelete(fila.id)"><v-icon small>close</v-icon></v-btn>
                  </template>
                  <span>Eliminar registro</span>
                </v-tooltip>
              </v-layout>
            </td>
          </tr>
        </table>
      </div></v-card>&nbsp;
      <div class="ml-2">
        <v-card style="border-radius: 7px 7px 7px 7px;opacity:0.7" v-if="selected.id>0 || editMode">
          <v-card-title class="grey lighten-4 pt-2 pb-2">
            <h4>Detalle de escritura</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="detalle">
            <div class="elevation-2 pa-2 grey lighten-4 ">
              <table>
                <tr v-for="(obj,key) in selected" :key="key" class="preview">
                  <th class="text-left">{{key | capitalize}}</th>
                  <td>
                    <select v-if="key==='inscrita'" v-model="selected.inscrita" :disabled="!editMode">
                      <option value="Si">Si</option>
                      <option value="No">No</option>              
                    </select>
                    <select v-if="key==='locación'" v-model="selected.locación" :disabled="!editMode">
                      <option value="Rural">Rural</option>
                      <option value="Urbana">Urbana</option>
                    </select>
                    <select v-if="key==='sucursal'" v-model="selected.sucursal" :disabled="!editMode">
                      <option value="Nueva Guinea">Nueva Guinea</option>
                      <option value="Muelle de los Bueyes">Muelle de los Bueyes</option>
                      <option value="Rama">Rama</option>
                    </select>
                    <select v-if="key==='estado'" v-model="selected.estado" disabled>
                      <option value=0>En archivo</option>
                      <option value=1>Prestado</option>
                    </select>
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" icon small flat color="warning" v-if="key==='estado'" @click="showMovs()"><v-icon samll>visibility</v-icon></v-btn>
                      </template>
                      <span>Mostrar movimientos</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" icon small flat color="primary" v-if="key==='estado'" @click="dlgEstado=true"><v-icon samll>cached</v-icon></v-btn>
                      </template>
                      <span>Cambiar estado</span>
                    </v-tooltip>
                    <input :id="key" v-if="key!='inscrita' && key!='locación' && key!='estado' && key!='sucursal'" :type="key==='elaborada' || key==='entrada' || key==='salida'?'date':'text'" v-model="selected[key]" :disabled="key!='id'?!editMode:true">
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" icon small flat color="warning" v-if="key==='créditos' && selected[key].length>0" @click="showCréditos()"><v-icon samll>visibility</v-icon></v-btn>
                      </template>
                      <span>Mostrar créditos</span>
                    </v-tooltip>
                  </td>
                </tr>
                <tr class="preview" v-if="selected.id">
                  <th class="text-left">Imagen</th>
                  <td class="grey lighten-4">
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-btn v-on="on" icon flat color="warning" @click="dlgImg=true"><v-icon>visibility</v-icon></v-btn>
                      </template>
                      <span>Mostrar archivo PDF</span>
                    </v-tooltip>
                  </td>
                </tr>
              </table>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="selected.id || editMode" dark :color="editMode?'primary':'warning'" flat @click="save()">{{editMode?'Guardar&nbsp;':'Editar&nbsp;'}} <v-icon>{{editMode?'save':'edit'}}</v-icon></v-btn>
            <v-btn dark color="error" @click="editMode=false;if(!selected.id){selected={}}" v-if="editMode">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-layout>
    <v-dialog v-model="loading" persistent width="140">
      <v-flex class="pa-4 white blue--text">
        <v-flex>
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex> 
        <v-divider></v-divider>
        <v-flex><h2>ESPERE...</h2></v-flex>
      </v-flex>
    </v-dialog>
    <v-dialog width="600" v-model="dlgImg">
      <v-card>
        <v-card-text>
          <object :data="myPdf" width="100%" height="500" type="application/pdf"></object>
          <input accept="application/pdf" ref="inputImgEscritura" type="file" style="display:none" v-on:change="subirPDF()">
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="$refs.inputImgEscritura.click()">Cambiar imagen</v-btn>
          <v-btn color="error" @click="dlgImg=false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dlgEstado" width="500">
      <v-card>
        <v-card-title class="grey lighten-4"><h3>{{selected.estado==0?'Prestar':'Ingresar'}}&nbsp;escritura</h3></v-card-title>
        <v-card-text>
          <v-text-field label="Nombre:" v-model="nuevoEstado.nombre"></v-text-field>
          <v-text-field label="Observación:" v-model="nuevoEstado.observación"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon dark color="success" @click="saveEstado()"><v-icon>save</v-icon></v-btn>
          <v-btn icon dark color="error" @click="dlgEstado=false"><v-icon>close</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dlgMovs" width="500">
      <v-card>
        <v-card-title class="grey lighten-4"><h3>Registro de movimientos de escritura {{selected.id}}</h3></v-card-title>
        <v-card-text>
          <table class="elevation-1">
            <tr>
              <th class="text-left" v-for="(item,key) in movimientos[0]" :key="key">{{key | capitalize}}</th>
            </tr>
            <tr v-for="(fila,i) in movimientos" :key="i">
              <td v-for="(col,key) in fila" :key="i+key">{{key==='tipo'?fila[key]==0?'En archivo':'Prestada':fila[key]}}</td>
            </tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon dark color="error" @click="dlgMovs=false"><v-icon>close</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dlgCréditos" width="900">
      <v-card>
        <v-card-title class="grey lighten-4"><h3>Créditos dependientes de escritura #{{selected.id}}</h3></v-card-title>
        <v-card-text>
          <table class="elevation-1">
            <tr>
              <th class="text-left" v-for="(item,key) in créditos[0]" :key="key">{{key | capitalize}}</th>
            </tr>
            <tr v-for="(fila,i) in créditos" :key="i">
              <td v-for="(col,key) in fila" :key="i+key">{{fila[key]}}</td>
            </tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon dark color="error" @click="dlgCréditos=false"><v-icon>close</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import axios from 'axios'
import { setTimeout } from 'timers';
export default {
  name: 'App',
  data () {
    return {

      título:'Control de escrituras',
      buscar:'',
      tabla:[],
      columnas:['Id','Número','Tipo','Elaborada','Locación','Dueño'],
      selected:{},
      nuevo:{número:'',tipo:'',elaborada:'',locación:'','tipo propiedad':'',extensión:'',inscrita:'','datos registral':'',dueño:'',fiador:'',sucursal:'',créditos:'',entrada:'',salida:''},
      editMode:false,
      loading:false,
      dlgImg:false,
      myPdf:'',
      dlgEstado:false,
      nuevoEstado:{tipo:'',nombre:'',observación:''},
      movimientos:[],
      dlgMovs:false,
      créditos:[],
      dlgCréditos:false
    }
  },
  watch:{
    editMode:(val)=>{
      var obj=document.getElementById('número')
      if(!obj){return}
      setTimeout(()=>{obj.focus();},100)
    },
    buscar:(value)=>{
      this.selected={}
    },
    selected:{
      handler(val,old){
        var mv=this;
        if(val.id!=old.id){
          if(val.id){this.editMode=false}
          var now=new Date()
          now=now.getDate()+now.getMonth()+now.getFullYear()+now.getHours()+now.getMinutes()+now.getSeconds()
          this.myPdf=mv.$store.state.rutaEscrituras+val.id+".pdf?"+now
        }
      },
      deep:true
    },

  },
  methods:{
    obtenerTabla:function(){
      var mv=this
      mv.loading=true
      axios.post(mv.$store.state.server +'buscardatos',{tabla:'cdetalleescritura'}).then(res=>{
        mv.loading=false
        res.data.d=JSON.parse(res.data.d)
        mv.tabla=res.data.d
      }).catch(err=>{console.log(err)});
    },
    save:function(){
      if(!this.editMode){this.editMode=true;return}
      var mv=this
      mv.loading=true
      var campos=[],valores=[]
      Object.keys(mv.selected).forEach(k=>{
        if(mv.selected[k].length===0){valores.push('null')}
        else{valores.push("'"+mv.selected[k]+"'")}
        campos.push('`'+k+'`')
        })
      campos=campos.join(',')
      valores=valores.join(',')
      axios.post(mv.$store.state.server +'Guardar2',{tabla:'cdetalleescritura',campos:campos,valores:valores}).then(res=>{
        var tipo='error',msg="Guardado correctamente"
        mv.loading=false
        if(res.data.d.substr(0,3)==="id:"){
          mv.editMode=false;tipo='success';
          if(!mv.selected.id){mv.$set(mv.selected,"id",res.data.d.split(':')[1]);mv.tabla.push(mv.clonar(mv.selected))}else{
            mv.tabla.forEach((item,index)=>{
              if(item.id===mv.selected.id){mv.$set(mv.tabla,index,Object.assign({},mv.selected));mv.selected=mv.clonar(mv.tabla[index])}
            })
          }
        }else{msg=res.data.d}
        mv.$swal({type:tipo,text:msg})
      })
    },
    tryDelete:function(id){
      var mv=this
      mv.$swal({type:'question',text:'¿Quiere borrar el registro actual [id='+id+']?',showCancelButton:true}).then(res=>{
        if(res.value){mv.delete(id)}
      })
    },
    delete:function(id){
      var mv=this
      axios.post(mv.$store.state.server +'Eliminar',{tabla:'cdetalleescritura',condicion:id}).then(res=>{
        var tipo='error'
        if(res.data.d==='Borrado correctamente'){
          var i=mv.tabla.findIndex(item=>{item.id===id})
          mv.tabla.splice(i)
          tipo='success'
          mv.selected={}
        }
        mv.$swal({type:tipo,text:res.data.d})
      })
    },
    clonar:function(obj){
      var result=JSON.parse(JSON.stringify(obj))
      return result;
    },
    subirPDF:function(){
      var mv=this
      var e=this.$refs.inputImgEscritura
      if(e.files && e.files[0]){
        var FR = new FileReader();
        FR.addEventListener("load", function (e) {
            var file = e.target.result;
            var params = { nombre:mv.selected.id+'.pdf',doc:file };
            axios.post(mv.$store.state.server+'GuardarPdf', params).then(r => {
                if (r.data.d === "Archivo guardado correctamente") {
                  var now=new Date().toLocaleString().replace(/\//g,'')
                  now = now + new Date().toLocaleTimeString().replace(/\:/g,'')
                  now = now.replace(/ /g,'')
                  mv.myPdf=mv.$store.state.rutaEscrituras+mv.selected.id+".pdf?"+now
                  mv.$swal({type:'success',text:r.data.d})                            
                }
            }).catch(error => { console.log(error)});
        });
        FR.readAsDataURL(e.files[0]);
        e.value = '';
      }
    },
    saveEstado:function(){
      var mv=this
      var campos='escritura,tipo,nombre,observación'
      var valores=`'${mv.selected.id}','${Math.abs(mv.selected.estado-1)}','${mv.nuevoEstado.nombre}','${mv.nuevoEstado.observación}'`
      var params={tabla:'movescrituras',campos:campos,valores:valores}
      console.log(params)
      axios.post(mv.$store.state.server +'Guardar',params).then(res=>{
        var msg,tipo
        if(res.data.d.substr(0,3)==='id:'){
          mv.selected.estado=Math.abs(mv.selected.estado-1)
          var i=mv.tabla.findIndex(item=>{item.id===mv.selected.id})
          if(i>=0){mv.$set(mv.tabla,i,Math.abs(mv.selected-1))}
          Object.keys(mv.nuevoEstado).forEach(k=>{mv.nuevoEstado[k]=''})
          tipo='success'
          msg='Se actualizó el estado'
        }else{tipo='error',res.data.d}
        mv.$swal({type:tipo,text:msg})
      })
    },
    showMovs:function(){
      var mv=this
      var params={tabla:'movescrituras',condicion:mv.selected.id}
      axios.post(mv.$store.state.server +'buscarcampo',params).then(res=>{
        mv.movimientos=JSON.parse(res.data.d).reverse()
        if(mv.movimientos.length>0){
          mv.dlgMovs=true
        }else{
          mv.$swal({type:'info',title:'No se encontraron movimientos'})
        }
      })
    },
    showCréditos:function(){
      var mv=this
      var params={tabla:'vcréditos',condicion:mv.selected.créditos}
      axios.post(mv.$store.state.server +'buscarcampo',params).then(res=>{
        mv.créditos=JSON.parse(res.data.d).reverse()
        if(mv.créditos.length>0){
          mv.dlgCréditos=true
        }else{
          mv.$swal({type:'info',title:'No se encontraron créditos dependientes'})
        }
      })
    }
  },
  computed:{
    tablaFiltrada:function(){
      var mv=this
      if(mv.buscar.toString().trim().length===0){return mv.tabla.slice(0,20)}
      var result=mv.tabla.filter(f=>{
        var cad=Object.values(f).join(' ').toLowerCase()
        return cad.indexOf(mv.buscar.toLowerCase())>=0
      })
      result=result.slice(0,20)
      return result
    }
  },
  filters:{
    capitalize:function(value){
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  mounted:function(){
    this.obtenerTabla()
  }
}
</script>
<style scoped>
  table{border-collapse: collapse;background: white}
  tr{border-bottom: 1px solid #eee;cursor: pointer;}
  .selected{background-color: dodgerblue;color:white}
  th,td,.div-header{padding: 4px}
  th,.div-header{background: linear-gradient(to bottom,rgb(253,253,253)0%,rgb(245,245,245)100%)}
  .text-left{text-align: left}
  td .v-btn{margin: 0}
  .preview{cursor:initial;}
  .div-header{width: 100%;border-bottom: 1px solid #eee;font-weight: bolder}
  .preview td{padding: 0}
  td input,td select{margin: 0;background: white;padding: 4px;border:none;width: 300px}
  .detalle table tr th,.detalle table tr td{background:rgb(245,245,245)}
  td input:disabled,td select:disabled{background:rgb(245,245,245)}
</style>
