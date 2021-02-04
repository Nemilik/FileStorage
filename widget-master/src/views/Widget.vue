<template>
  <section>
    <FillingForm v-if="step.fillingForm" @userInfo="userInfo" />

    <Ordering v-if="step.ordering" @createOrder="payment" :userData="userData" :product="product" />
    
    <CardInfo v-if="step.CardInfo" :items="item" :userData="userData" :order="order" />
  </section>
</template>

<script>
  import Vue from 'vue'
  import Top from '@/components/Top.vue'
  import FillingForm from '@/components/FillingForm.vue'
  import Ordering from '@/components/Ordering.vue'
  import CardInfo from '@/components/CardInfo.vue'
  import axios from 'axios'

  export default {
    components: {
      Top,
      FillingForm,
      Ordering,
      CardInfo
    },
    data() {
      return {
        step: {
          fillingForm: true,
        },
        userData: null,
        inn: null,
        product: '',
        order: {},
        item: false,
      }
    },
    methods: {
      userInfo(data) {
        this.userData = data.user;
        this.product = data.product;

        this.step = {
          ordering: true
        }
      },
      payment({order, email}) {
        var widget = new cp.CloudPayments();

        this.order = order;
        this.userData.email = email;
        const userData = this.userData;

        let promise = new Promise(function(resolve, reject) {
          widget.charge({ 
            publicId: 'pk_5d2c1524cbcc49a9bb3e883524eca',
            description: 'Проверка собственников',
            amount: Number(order.total_amount),
            currency: 'RUB',
            invoiceId: order.id,
            accountId: order.jwt.person.email,
            skin: "mini",
            data: {
              userId: order.jwt.id
            }
          },
          function(options) { // success
            let userInfo = [{
              order_item_id: order.orderItemsId,
              first: userData.name,
              surname: userData.surname,
              ownerType: 1,
              birthday: new Date(userData.birthDateFormat).toISOString(),
              region: userData.region.id,
            }];

            if (userData.passChecked) {
              userInfo[0].passport = userData.passport.number;
            }
            if (userData.patronymic)
              userInfo[0].patronymic = userData.patronymic

            axios.post('https://api-test.realtycloud.ru/risk/owner', JSON.stringify(userInfo))
              .then((res) => {

                const token = order.jwt.token;
                const orderItemsId = order.orderItemsId;

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
                  
                  resolve(item)
                });
              })
              .catch((err) => {
                console.log(err);
                return
              });
          },
          function (reason, options) { // fail
            resolve(false)
          });
        });

        promise
          .then(
            result => {
              if (result) {
                this.item = result;
                this.step = {CardInfo: true};
              }
          });   
        }  
      }
    }
</script>

