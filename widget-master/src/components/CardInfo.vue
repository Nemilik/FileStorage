<template>
  <section>
    <div class="CardInfo">
      <Top :title="'Заказ проверки физического лица'" :pd9="true" />
      <div class="body border rounded-bottom">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <div>
              <i class="fa fa-user text-primary" aria-hidden="true"></i>
              <strong class="text-muted">Заказ принят в работу.</strong>
              <div>
                <strong class="text-muted">Результат проверки будет отправлен на ваш e-mail *{{userData.email}}*</strong>
              </div>
            </div>
          </div>
          <div class="list-group-item">
            <div class="fio">
              <strong class="text-primary">{{userData.surname}} {{userData.name}} {{userData.patronymic}}</strong>
            </div>
            <div class="lableData data">
              <i class="fa fa-address-card text-primary" aria-hidden="true"></i><strong>Данные</strong> 
            </div>
            <div v-if="userData.passChecked" class="info row">
              <div class="infoBlock col-md-6">
                <div class="label">Паспорт</div>
                <strong class="value">{{userData.passport.number}}</strong>
              </div>
              <div class="infoBlock col-md-6">
                <div class="label">Дата рождения</div>
                <strong class="value">{{userData.birthDate}}</strong>
              </div>
            </div>
            <div class="info row">
              <div class="infoBlock col-md-6">
                <div class="label">Регион</div>
                <strong class="value">{{userData.region.region}}</strong>
              </div>
              <div class="infoBlock col-md-6">
                <div class="label">ИНН</div>
                <strong v-if="inn" class="value">{{inn}}</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-address-book text-primary" aria-hidden="true"></i><strong>Действительность паспорта</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.passport == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.passport">
                В базе недействительных паспортов: <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не числится</strong>
              </div>
              <div class="infoText" v-else>
                В базе недействительных паспортов: <strong class="text-danger">числится {{item.passportMessage}}</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-search text-primary" aria-hidden="true"></i><strong>Нахождение в розыске</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.mvdRf == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="!item.mvdRf">
                В базе данных розыска: <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не числится</strong>
              </div>
              <div class="infoText" v-else>
                В базе данных розыска: <strong class="text-danger">числится</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-university text-primary" aria-hidden="true"></i><strong>Федиральный реестр сведений о банкротстве</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.reestrBankrotov == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.reestrBankrotov > 0">
                В реестре Банкротов: <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> отсутствует</strong>
              </div>
              <div class="infoText" v-else>
                В реестре Банкротов: <strong class="text-danger">числится</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-credit-card text-primary" aria-hidden="true"></i><strong>Налоговые задолженности</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.taxes == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.taxes == 0 || !item.taxes">
                Задолженности <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> отсутствуют</strong>
              </div>
              <div class="infoText" v-else-if="item.taxes > 0">
                Найдено задолженностей: <strong class="text-danger">{{item.taxes}}</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-file text-primary" aria-hidden="true"></i><strong>Сведения о долгах у судебных приставов</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.fssp == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.fssp == 0">
                В базе данных ФССП исполнительные производства <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не числятся</strong>
              </div>
              <div class="infoText" v-else-if="item.fssp > 0">
                Найдено записей об ИП: <strong class="text-danger">{{item.fssp}}</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-gavel text-primary" aria-hidden="true"></i><strong>Судебные акты Российской Федерации</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.judge == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.judge == 0">
                В базе ГАС «Правосудие» совпадения по фамилии и инициалам<br> <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не найдены</strong>
              </div>
              <div class="infoText" v-else-if="item.judge > 0">
                В базе ГАС «Правосудие» по фамилии и инициалам в субъекте РФ<br>"{{userData.region.region}}" <strong class="text-danger">найдено {{item.judge}} совпадений</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-gavel text-primary" aria-hidden="true"></i><strong>Арбитражные суды</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.arbitr == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.arbitr == 0">
                В базе арбитражных судов по фамилии и инициалам в субъекте РФ<br>"{{userData.region.region}}" совпадения <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не найдены</strong>
              </div>
              <div class="infoText" v-else-if="item.arbitr > 0">
                В базе арбитражных судов по фамилии и инициалам в субъекте РФ<br>"{{userData.region.region}}" <strong class="text-danger">найдено {{item.arbitr}} совпадений</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-briefcase text-primary" aria-hidden="true"></i><strong>Самозанятый</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.npdStatus == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.npdStatus == false">
                В реестре самозанятых <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не найдены</strong>
              </div>
              <div class="infoText" v-else-if="item.npdStatus">
                В реестре самозанятых <strong class="text-danger">найден</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-user text-primary" aria-hidden="true"></i><strong>Руководитель или учредитель юридического лица</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.founder == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="item.founder == 0">
                Среди руководителей и учредителей <strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не значится</strong>
              </div>
              <div class="infoText" v-else-if="item.founder > 0">
                Найдено задолженностей <strong class="text-danger">{{item.founder}}</strong>
              </div>
            </div>
            <div class="infoBlock">
              <div class="data d-flex justify-content-between">
                <div>
                  <i class="fa fa-exclamation-triangle text-primary" aria-hidden="true"></i><strong>Росфинмониторинг</strong>
                </div>
                <i class="fa fa-info-circle text-muted" aria-hidden="true"></i>
              </div>
              <div class="infoText text-muted" v-if="item.rosfinmonitoring == 'process'">
                Проверка в данный момент находится <strong>в работе<img src="@/assets/icons/loading.gif" width="14"></strong>
              </div>
              <div class="infoText" v-else-if="!item.rosfinmonitoring">
                В перечне о причастности к экстремистской деятельности<br>или терроризму:<strong class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i> не найден</strong>
              </div>
              <div class="infoText" v-else-if="item.rosfinmonitoring">
                В перечне о причастности к экстремистской деятельности<br>или терроризму:<strong class="text-danger">найден</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  </section>
</template>

<script>
  import Top from '@/components/Top.vue'
  import axios from 'axios'

  export default {
    data() {
      return {
        item: '',
        inn: false
      }
    },
    components: {
      Top
    },
    props: [
      'userData',
      'order',
      'items',
    ],
    mounted: function () {
      this.item = this.items
      this.$nextTick(function () {
        this.upldateClientData()
      })
    },
    methods: {
      upldateClientData() {
        const token = this.order.jwt.token;
        const orderItemsId = this.order.orderItemsId;

        let th = this;

        this.$nextTick(function () {
          window.setInterval(function () {
            axios.get(`https://api-test.realtycloud.ru/admin/risk/report/${orderItemsId}`, {
              headers: {
                'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
              let data = response.data.data.owners[0]

              let item = {}
              
              if (data.owner.passport.valid.executionStatus == "in-progress" || data.owner.passport.valid.executionStatus == "error")
                item.passport = "process"
              else if (data.owner.passport.valid.status == true) {
                item.passport = true;
              } else {
                item.passport = false;  
                item.passportMessage = data.owner.passport.valid.message;
              }


              if (data.mvdRf.executionStatus == "in-progress" || data.mvdRf.executionStatus == "error")
                item.mvdRf = "process"
              else if (data.mvdRf.found == true)
                item.mvdRf = false;
              else if (data.mvdRf.found == false)
                item.mvdRf = true;


              if (data.reestrBankrotov.executionStatus == "in-progress" || data.reestrBankrotov.executionStatus == "error")
                item.reestrBankrotov = "process"
              else if (data.reestrBankrotov.totalCount > 0)
                item.reestrBankrotov = true
              else (data.reestrBankrotov.totalCount == 0)
                item.reestrBankrotov = false

              if (data.owner.taxes.executionStatus == "in-progress" || data.owner.taxes.executionStatus == "error")
                item.taxes = "process"
              else if (data.owner.taxes.totalCount)
                item.taxes = data.owner.taxes.totalCount

              if (data.fssp.executionStatus == "in-progress" || data.fssp.executionStatus == "error")
                item.fssp = "process"
              else if (data.fssp.totalCount)
                item.fssp = data.fssp.totalCount

              if (data.judge.executionStatus == "in-progress" || data.judge.executionStatus == "error")
                item.judge = "process"
              else if (data.judge.totalCount)
                item.judge = data.judge.totalCount

              if (data.arbitr.executionStatus == "in-progress" || data.arbitr.executionStatus == "error")
                item.arbitr = "process"
              else if (data.arbitr.totalCount)
                item.arbitr = data.arbitr.totalCount

              if (data.owner.npdStatus.executionStatus == "in-progress" || data.owner.npdStatus.executionStatus == "error")
                item.npdStatus = "process"
              else if (data.owner.npdStatus.status == true) 
                item.npdStatus = false;
              else 
                item.npdStatus = true;

              if (data.owner.founder.executionStatus == "in-progress" || data.owner.founder.executionStatus == "error")
                item.founder = "process"
              else if (data.owner.founder.totalCount)
                item.founder = data.owner.founder.totalCount

              if (data.rosfinmonitoring.executionStatus == "in-progress" || data.rosfinmonitoring.executionStatus == "error")
                item.rosfinmonitoring = "process"
              else if (data.rosfinmonitoring.isFoundInExtremismOrTerroristList) 
                item.rosfinmonitoring = false;
              else 
                item.rosfinmonitoring = true; 

              th.item = item;
            });
          },3000);
        });
      }   
    }
  }
</script>

<style lang="scss" scoped>
  .btn-primary {
    background-color: #409eff;
    border-color: #409eff;
  }
  .text-primary {
    color: #2281f9 !important;
  }
  button {
    font-size: 14px;
    font-weight: 500;
  }
  .inputDate {
    .form-control:disabled, .form-control[readonly] {
      background-color: #fff !important;
    }
  }
  .fa-user {
    margin-right: 12px;
  }
  .info {
    margin-left: 19px;
  }
  .infoBlock {
    margin-bottom: 14px;
    img {
      margin-left: 7px;
    }
    .data {
      i {
        font-size: 15px;
        width: 14px;
      }
    }
    .infoText {
      padding-left: 30px;
    }
    .label {
      color: #6c757d;
      font-size: 14px;
    }
    strong {
      i {
        font-size: 13px;
      }
    }
  }
  .CardInfo {
    width: 720px;
    margin: 0 auto;
    font-weight: 400;
    font-family: Geometria,sans-serif;
    .card-header {
      font-size: 18px;
      div {
        div {
          margin-left: 27px;
        }
      }
    }
    .list-group-item {
      border: none;
    }
    .body {
      padding: 6px;
    }
    .lableData {
      margin-bottom: 10px;
    }
    .infoText {
      font-size: 14px;
    }
    .info {
      padding-left: 6px;
      .infoBlock {
        margin-bottom: 6px;
      }
    }
    .list-group-item > .infoBlock {
      margin-top: 16px;
    }
    .data {
      i {
        margin-right: 16px;
      }
      .fa-info-circle {
        font-size: 13px;
      }
    }
    .fio {
      font-weight: 600;
      font-size: 19px;
      margin-left: 28px;
      margin-bottom: 14px;
    }
  }
</style>