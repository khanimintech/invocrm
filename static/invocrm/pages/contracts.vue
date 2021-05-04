<template>
  <div class="content">
    <div class="row overview-row">
      <overview-box
        v-for="overview in overviewItems"
        :key="overview.id"
        :overview="overview"
        :width="100 / overviewItems.length - 1"
      />
    </div>
    <div class="row jc-sb doc-row">
      <h2>Ümumi say: {{ data.length }}</h2>
      <div>
        <div>
          <p-button
            icon="pi pi-plus"
            label="Sənəd yarat"
            class="p-button"
            @click="toggleCreateMenu"
            aria-haspopup="true"
            aria-controls="create_menu"
          />
        </div>
        <p-menu
          id="create_menu"
          ref="create_menu"
          :model="createMenuItems"
          :popup="true"
        ></p-menu>
      </div>
    </div>
    <div class="table-row row">
      <p-data-table
        :value="data"
        :paginator="true"
        class="p-datatable-customers"
        :rows="10"
        dataKey="id"
        :filters="filters"
        :loading="loading"
      >
        <template #header>
          <div class="table-header">
            List of Customers
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <p-inputtext
                v-model="filters['global']"
                placeholder="Global Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <p-column field="name" header="Name">
          <template #body="slotProps">
            <span class="p-p-column-title">Name</span>
            {{ slotProps.data.name }}
          </template>
          <template #filter>
            <p-inputtext
              type="text"
              v-model="filters['name']"
              class="p-p-column-filter"
              placeholder="Search by name"
            />
          </template>
        </p-column>
        <p-column
          header="Country"
          filterField="country.name"
          filterMatchMode="contains"
        >
          <template #body="slotProps">
            <span class="p-p-column-title">Country</span>
            <img
              src="../../assets/images/flag_placeholder.png"
              :class="'flag flag-' + slotProps.data.country.code"
              width="30"
            />
            <span class="image-text">{{ slotProps.data.country.name }}</span>
          </template>
          <template #filter>
            <p-inputtext
              type="text"
              v-model="filters['country.name']"
              class="p-p-column-filter"
              placeholder="Search by country"
            />
          </template>
        </p-column>
        <p-column
          header="Representative"
          filterField="representative.name"
          filterMatchMode="in"
        >
          <template #body="slotProps">
            <span class="p-p-column-title">Representative</span>
            <img
              :alt="slotProps.data.representative.name"
              :src="'demo/images/avatar/' + slotProps.data.representative.image"
              width="32"
              style="vertical-align: middle"
            />
            <span class="image-text">{{
              slotProps.data.representative.name
            }}</span>
          </template>
          <template #filter>
            <p-multiselect
              v-model="filters['representative.name']"
              :options="representatives"
              optionLabel="name"
              optionValue="name"
              placeholder="All"
              class="p-p-column-filter"
            >
              <template #option="slotProps">
                <div class="p-multiselect-representative-option">
                  <img
                    :alt="slotProps.option.name"
                    :src="'demo/images/avatar/' + slotProps.option.image"
                    width="32"
                    style="vertical-align: middle"
                  />
                  <span class="image-text">{{ slotProps.option.name }}</span>
                </div>
              </template>
            </p-multiselect>
          </template>
        </p-column>
        <p-column
          field="date"
          header="Date"
          filterMatchMode="custom"
          :filterFunction="filterDate"
        >
          <template #body="slotProps">
            <span class="p-p-column-title">Date</span>
            <span>{{ slotProps.data.date }}</span>
          </template>
          <template #filter>
            <p-calendar
              v-model="filters['date']"
              dateFormat="yy-mm-dd"
              class="p-p-column-filter"
              placeholder="Registration Date"
            />
          </template>
        </p-column>
        <p-column field="status" header="Status" filterMatchMode="equals">
          <template #body="slotProps">
            <span class="p-p-column-title">Status</span>
            <span :class="'customer-badge status-' + slotProps.data.status">{{
              slotProps.data.status
            }}</span>
          </template>
          <template #filter>
            <p-dropdown
              v-model="filters['status']"
              :options="statuses"
              placeholder="Select a Status"
              class="p-p-column-filter"
              :showClear="true"
            >
              <template #option="slotProps">
                <span :class="'customer-badge status-' + slotProps.option">{{
                  slotProps.option
                }}</span>
              </template>
            </p-dropdown>
          </template>
        </p-column>
        <p-column field="activity" header="Activity" filterMatchMode="gte">
          <template #body="slotProps">
            <span class="p-p-column-title">Activity</span>
            <p-p-progressbar
              :value="slotProps.data.activity"
              :showValue="false"
            />
          </template>
          <template #filter>
            <p-inputtext
              type="text"
              v-model="filters['activity']"
              class="p-p-column-filter"
              placeholder="Minimum"
            />
          </template>
        </p-column>
      </p-data-table>
    </div>
  </div>
</template>


<script src="./../services/ContractsService.js"></script>
<script>
// const  ContractsService = require('./../services/ContractsService.js');

module.exports = {
  methods: {
    toggleCreateMenu: function () {
      this.$refs.create_menu.toggle(event);
    },
     filterDate: function(value, filter) {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            return value === this.formatDate(filter);
        },
        formatDate: function(date) {
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            return date.getFullYear() + '-' + month + '-' + day;
        }
  },
  components: {
    "overview-box": overviewBox,
    "p-button": button,
    "p-menu": menu,
    "p-data-table": datatable,
     "p-inputtext": inputtext,
     "p-column": column,
     "p-calendar": calendar,
     "p-multiselect": multiselect,
     "p-dropdown": dropdown,
  },
  computed: {},
    created: function() {
    },
    mounted: function() {
        ContractsService.index().then((/*data*/) => {
            const data = [
                {"brand": "Volkswagen", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
                {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
                {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
                {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
                {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
                {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
                {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
                {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
                {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
                {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
            ]
            this.data = data
            this.loading = false;
        });
    },
    name: "contracts",
  data: function () {
    return {
    //   data: [
    //     {
    //       id: 1,
    //       organization: "MCDoalds",
    //       type: "Xidmet",
    //       start_date: "01.12.2020",
    //       end_date: "01.12.2020",
    //       manager: "Bextiyar Babayev",
    //       status: 1,
    //       owner: "Sabina Safarzade",
    //       annnex_id: "1",
    //     },
    //   ],
        data: [],
        filters: {},
        loading: true,
        representatives: [
            {name: "Amy Elsner", image: 'amyelsner.png'},
            {name: "Anna Fali", image: 'annafali.png'},
            {name: "Asiya Javayant", image: 'asiyajavayant.png'},
            {name: "Bernardo Dominic", image: 'bernardodominic.png'},
            {name: "Elwin Sharvill", image: 'elwinsharvill.png'},
            {name: "Ioni Bowcher", image: 'ionibowcher.png'},
            {name: "Ivan Magalhaes",image: 'ivanmagalhaes.png'},
            {name: "Onyama Limba", image: 'onyamalimba.png'},
            {name: "Stephen Shaw", image: 'stephenshaw.png'},
            {name: "XuXue Feng", image: 'xuxuefeng.png'}
        ],
        statuses: [
            'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
        ],
      overviewItems: [
        {
          sum: 25,
          status: "Vaxtı bitən",
          color: "#E91E63",
        },
        {
          sum: 18,
          status: "Vaxti bitmeyinə 2 həftə qalan",
          color: "#FFB300",
        },
        {
          sum: 3,
          status: "Prosesdə",
          color: "#42A5F5",
        },
        {
          sum: 14,
          status: "Təsdiqlənib",
          color: "#66BB6A",
        },
      ],
      createMenuItems: [
        {
          label: "Alqı-satqı",
          to: "/sale",
        },
        {
          label: "Xidmət",
          to: "/service",
        },
        {
          label: "Agent",
          to: "/agent",
        },
        {
          label: "Distribyutor",
          to: "/distirbuter",
        },
      ],
    }
  }
};
</script>
<style>
.overview-row {
  justify-content: space-between;
  flex-wrap: wrap;
}

#create_menu ul {
  margin-left: none;
  list-style: none;
}

.doc-row {
  margin-top: 20px;
}
</style>