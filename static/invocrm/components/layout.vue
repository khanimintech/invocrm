<template>
 <div class="sidebar-page">
     <div class="nav row" >
        <div>
            <div class="row">
              <div v-on:click="toggleMenu">
                <p-button  icon="pi pi-bars" class="p-button-rounded p-button-text"></p-button>
              </div> 
        
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <p-inputtext type="text" placeholder="Search"  class="p-inputtext-lg" />
                </span>
      
            </div>
          </div>
          <div  @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"> 
            <p-avatar icon="pi pi-user" class="p-mr-2" size="medium" style="background-color:#2196F3; color: #ffffff" shape="circle" />
          </div>
            <p-menu id="overlay_menu" ref="menu" :model="userMenuItems" :popup="true"></p-menu>
        </div>
       <section class="sidebar-layout">
             <b-sidebar
                position="static"
                :reduce="reduce"
                type="is-light"
                open
                :fullheight="fullheight"
                :right="right"

              
            >
                <div class="p-1">
                     <b-menu class="is-custom-mobile">
                        <b-menu-list >
                            <b-menu-item active expanded  icon="folder-multiple"   label="Müqavilə">
                                <b-menu-item icon="text-box" label="Müqavilələr" v-on:click="redirectPage('contracts')"></b-menu-item>
                                <b-menu-item icon="card-plus" label="Əlavələr" v-on:click="redirectPage('annexes')"></b-menu-item>
                                <b-menu-item icon="contacts" label="Kontakt" v-on:click="redirectPage('contacts')"></b-menu-item>
                                 <b-menu-item icon="cash-multiple" label="Bank" v-on:click="redirectPage('bank')"></b-menu-item>
                            </b-menu-item>
                        <b-menu-list>
                            <b-menu-item label="Sorğu" icon="help" v-on:click="redirectPage('help')"></b-menu-item>
                        </b-menu-list>
                      
                    </b-menu>
                </div>
            </b-sidebar>

                  <slot></slot>
  
        </section>
    </div>
</template>


<script>
module.exports = {
  methods: {
    toggleMenu: function () {
      this.reduce = !this.reduce;
    },
    toggle: function () {
      this.$refs.menu.toggle(event);
    },
    redirectPage: function(path){
      router.push(path)
    }
  },
  components: {
    "p-button": button,
    "p-avatar": avatar,
    "p-menu": menu,
    "p-inputtext": inputtext,
  },
  data: function () {
    return {
      reduce: true,
      open: true,
      fullheight: true,
      fullwidth: false,
      overlay: false,
      right: false,
      userMenuItems: [
        {
          label: "Çıxış",
          icon: "pi pi-times",
          command: () => {
            cosole.log("log out");
          },
        },
      ],
      name: "layout",
    };
  },
};
</script>
<style>
.b-sidebar {
  color: #4a4a4a;
  z-index: 1;
  margin-top: -1px;
}

.b-sidebar .sidebar-content{
  width: 220px;
}
.b-sidebar .sidebar-content.is-fullheight {
  background-color: #fff;
}


.menu-list a.is-active {
  border-left: 4px solid rgb(29, 92, 255);
  color: initial;
  background-color: transparent;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  transition: border 0.08s ease;
  z-index: 60;
}

.p-1 {
  padding: 1em;
}
.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
}
.sidebar-page .sidebar-layout {
  display: flex;
  flex-direction: row;
    min-height: calc(100vh - 60px);
}
@media screen and (max-width: 1023px) {
  .b-sidebar
    .sidebar-content.is-mini-mobile:not(.is-mini-expand)
    .menu-list
    li
    a
    span:nth-child(2),
  .b-sidebar
    .sidebar-content.is-mini-mobile.is-mini-expand:not(:hover)
    .menu-list
    li
    a
    span:nth-child(2) {
    display: none;
  }
  .b-sidebar
    .sidebar-content.is-mini-mobile:not(.is-mini-expand)
    .menu-list
    li
    ul,
  .b-sidebar
    .sidebar-content.is-mini-mobile.is-mini-expand:not(:hover)
    .menu-list
    li
    ul {
    padding-left: 0;
  }
  .b-sidebar
    .sidebar-content.is-mini-mobile:not(.is-mini-expand)
    .menu-list
    li
    ul
    li
    a,
  .b-sidebar
    .sidebar-content.is-mini-mobile.is-mini-expand:not(:hover)
    .menu-list
    li
    ul
    li
    a {
    display: inline-block;
  }
  .b-sidebar
    .sidebar-content.is-mini-mobile:not(.is-mini-expand)
    .menu-label:not(:last-child),
  .b-sidebar
    .sidebar-content.is-mini-mobile.is-mini-expand:not(:hover)
    .menu-label:not(:last-child) {
    margin-bottom: 0;
  }
}
@media screen and (min-width: 1024px) {
  .b-sidebar
    .sidebar-content.is-mini:not(.is-mini-expand)
    .menu-list
    li
    a
    span:nth-child(2),
  .b-sidebar
    .sidebar-content.is-mini.is-mini-expand:not(:hover)
    .menu-list
    li
    a
    span:nth-child(2) {
    display: none;
  }
  .b-sidebar .sidebar-content.is-mini:not(.is-mini-expand) .menu-list li ul,
  .b-sidebar
    .sidebar-content.is-mini.is-mini-expand:not(:hover)
    .menu-list
    li
    ul {
    padding-left: 0;
  }
  .b-sidebar
    .sidebar-content.is-mini:not(.is-mini-expand)
    .menu-list
    li
    ul
    li
    a,
  .b-sidebar
    .sidebar-content.is-mini.is-mini-expand:not(:hover)
    .menu-list
    li
    ul
    li
    a {
    display: inline-block;
  }
  .b-sidebar
    .sidebar-content.is-mini:not(.is-mini-expand)
    .menu-label:not(:last-child),
  .b-sidebar
    .sidebar-content.is-mini.is-mini-expand:not(:hover)
    .menu-label:not(:last-child) {
    margin-bottom: 0;
  }
}
.is-mini-expand .menu-list a {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-content.is-mini .sidebar-title {
  display: none;
}
/**nav*/
.nav {
  width: 100%;
  height: 60px;
  box-shadow: 5px 0 13px 3px rgb(10 10 10 / 10%);
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
  z-index: 3;
  background-color: #fff;
}

.nav .p-inputtext{
  border: none;
}

.nav .p-inputtext:enabled:focus{
  box-shadow: none;
}

.nav .p-input-icon-left{
  margin-left: 20px;
}

.is-mini .menu-list a{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
}
</style>