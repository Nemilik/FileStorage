<template>
  <section>
    <div class="ordering">
      <Top :title="'Заказ проверки физического лица'" :pd9="true" />
      <div class="body border rounded-bottom">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <div>
              <i class="fa fa-user text-primary" aria-hidden="true"></i>
              <strong>Проверка введенных данных</strong>
            </div>
            <div>
              <i class="fa fa-info-circle text-primary" 
                title="Проверка осуществляется из открытых источников на основании введенных пользователем данных" 
                v-tippy="{ arrow: true, size: 'small' }" 
                aria-hidden="true"></i>
            </div>
          </div>
          <div class="list-group-item">
            <div class="fio">
              <i class="fa fa-address-card text-primary" aria-hidden="true"></i><strong>{{userData.surname}} {{userData.name}} {{userData.patronymic}}</strong>
            </div>
            <div class="info row">
              <div class="infoBlock col-md-6">
                <div class="label">Дата рождения</div>
                <strong class="value">{{userData.birthDate}}</strong>
              </div>
              <div class="infoBlock col-md-6">
                <div class="label">Регион</div>
                <strong class="value">{{userData.region.region}}</strong>
              </div>
            </div>
            <div v-if="userData.passport" class="info row">
              <div class="infoBlock col-md-6">
                <div class="label">Паспорт</div>
                <strong class="value">{{userData.passport.number}}</strong>
              </div>
              <div class="infoBlock col-md-6">
                <div class="label">Дата выдачи</div>
                <strong class="value">{{userData.passport.issueDate}}</strong>
              </div>
            </div>
            <div class="mail" @submit.prevent="addOrdering()">
              <form>
                <label for="email">Рузультат проверки будет отправлен вам на E-mail в течении 10 минут<i class="fa fa-info-circle"
                  aria-hidden="true"
                  title="Отчет формируется за 10 минут, но иногда проверка может осуществляться в течение 1 рабочего дня" 
                  v-tippy="{ arrow: true, size: 'small' }"></i></label>
                <input type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="userData.email" 
                  placeholder="E-mail для получения документа" required>
                <div class="text-center">
                  <button class="btn btn-primary" type="sumbmit">ПОДТВЕРДИТЬ ЗАКАЗ 349 РУБ.</button>
                </div>
              </form>
            </div>
            <footer class="row">
              <div class="col text-center">
                <div>
                  <i class="fa fa-file text-primary" aria-hidden="true"></i>
                </div>
                Результат в формате<br>PDF
              </div>
              <div class="col text-center">
                <div>
                  <i class="fa fa-rocket text-primary" aria-hidden="true"></i>
                </div>
                Быстрая обработка запросов, круглосуточно 24/7
              </div>
              <div class="col text-center">
                <div>
                  <i class="fa fa-reply text-primary" aria-hidden="true"></i>
                </div>
                Возврат денег, если мы не сможем предоставить отчет
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Top from '@/components/Top.vue'
  import axios from 'axios'
  import FillingForm from '@/components/FillingForm.vue'

  export default {
    data() {
      return {
      }
    },
    components: {
      Top
    },
    props: [
      'userData',
      'product'
    ],
    methods: {
      addOrdering() {
        let request = JSON.stringify({
          email: this.userData.email,
          order_items: [
            {
              product_id: this.product.product_id,
              object_key: "n/a"
            }
          ]
        });

        axios.post('https://api-test.realtycloud.ru/regorder', request)
          .then((response) => {
            const data = response.data.data

            const order = {
              id: data.order.id,
              total_amount: data.order.total_amount,
              orderItemsId: data.order.order_items[0].order_item_id,
              jwt: response.data.jwt
            }

            this.$emit('createOrder', {
              order,
              email: this.userData.email
            })
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ordering {
    width: 615px;
    margin: 0 auto;
    .body {
      padding: 6px;
    }
    .fa-user {
      margin-right: 12px;
    }
    .card-header {
      border-bottom: none;
      strong {
        font-size: 15px;
      }
    }
    .list-group-item {
      border-top: none;
    }
    .fio {
      margin-bottom: 10px;
      i {
        margin-right: 12px;
      }
    }
    .info {
      margin-left: 18px;
    }
    .mail {
      margin-top: 30px;
      font-weight: 500;
      div {
        margin-top: 22px;
      }
      i {
        margin-left: 6px;
      }
    } 
    footer {
      color: #6c757d;
      font-size: 13px;
      margin-top: 40px;
      i {
        font-size: 24px;
        margin-bottom: 10px;
      }
    }
  }
</style>