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
      <div>
        {{response}}
      </div>
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
      response: '-------'
    }
  },
  methods: {
    submit(e) {
      e.preventDefault();

      this.$axios
      .get(`/generate-report/${this.website}`)
      .then(response => (this.response = response));
    }
  },
}
</script>
