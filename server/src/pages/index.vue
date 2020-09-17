<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <v-form @submit="submit">
          <v-text-field
            v-model="website"
            label="Website"
            required
          ></v-text-field>
          <v-btn class="mr-4" type="submit">submit</v-btn>
        </v-form>
      </div>
      <iframe 
        v-if="show"
        :src="html"
        :height="600"
        :width="'100%'"
        frameborder="0"
      ></iframe>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      website: '',
      html: '-------',
      show: false
    }
  },
  methods: {
    submit(e) {
      e.preventDefault();

      this.$axios
      .post(`/generate-report`, { website: this.website })
      .then(response => (this.html = `data:text/html;charset=utf-8,${escape(response.data.html)}`, this.show = true ));
    }
  },
}
</script>
