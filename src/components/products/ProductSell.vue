<template>
  <div class="container">
    <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 offset-3 pt-3 card mt-5 shadow">
        <div class="card-body">
          <h3>Ürün Çıkışı</h3>
          <hr />
          <div class="form-group">
            <label>Ürün Adı</label>
            <select
              class="form-control"
              v-model="selectedProduct"
              @change="productSelected"
            >
              <option selected disabled>Lütfen bir ürün seçiniz...</option>
              <option
                :disabled="product.count == 0"
                :value="product.key"
                v-for="(product, index) in getProducts"
                :key="index"
              >
                {{ product.title }}
              </option>
            </select>
          </div>
          <transition name="fade" mode="out-in">
            <div class="card mb-2 border border-danger" v-if="product !== null">
              <div class="card-body">
                <div class="row">
                  <div class="col-12 text-center">
                    <div class="mb-3">
                      <span class="badge badge-info"
                        >Stok : {{ product.count }}</span
                      >
                      <span class="badge badge-primary"
                        >Fiyat : {{ product.price | currency }}</span
                      >
                    </div>
                    <p class="border border-warning p-2 text-secondary">
                      {{ product.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div class="form-group">
            <label>Adet</label>
            <input
              v-model="product_count"
              type="text"
              class="form-control"
              :class="{over : borderChange}"
              placeholder="Ürün adetini giriniz.."
            />
          </div>
          <hr />
          <button class="btn btn-primary" @click="save" :disabled="saveEnabled">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {loadingMixin} from "@/loadingMixin";
export default {
    mixins : [loadingMixin],
  data() {
    return {
      selectedProduct: null,
      product_count: null,
      product: null,
      saveButtonClicked: false,
      borderChange : false,
    };
  },
  computed: {
    ...mapGetters(["getProducts"]),
    saveEnabled() {
      if (this.selectedProduct !== null && this.product_count > 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch : {
      product_count(val){
          if (val > this.product.count) {
              this.borderChange = true;
          }
          else{
              this.borderChange = false;
          }
      },
  },
  methods: {
    productSelected() {
      this.product = this.$store.getters.getProduct(this.selectedProduct)[0];
    },
    save() {
      this.saveButtonClicked = true;
      let product = {
        key: this.selectedProduct,
        count: this.product_count,
      };
      this.$store.dispatch("sellProduct", product);
    },
  },
  beforeRouteLeave(from, to, next) {
    if (
      (this.selectedProduct !== null || this.product_count > 0) &&
      !this.saveButtonClicked
    ) {
      if (
        confirm(
          "Kaydedilmemiş değişiklikler var. Yine de çıkmak ister misiniz?"
        )
      ) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.border-danger {
  border-style: dashed !important;
}
.over {
  border-color: red;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset,
    0px 0px 8px rgba(255, 100, 255, 0.5);
}
</style>
