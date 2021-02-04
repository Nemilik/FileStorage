<template>
  <section>
    <div class="fillingForm">
      <Top :title="'Проверка физического лица'" />
      <form @submit.prevent="submitFillingForm()">
        <div class="margin">
          <div class="input-group">
            <input class="form-control inputIcon" 
              :class="{'border-danger': $v.surname.$dirty && !$v.surname.required}" 
              type="text" 
              name="surname" 
              placeholder="Фамилия" 
              v-model="surname">
            <div class="input-group-prepend">
              <span class="input-group-text" :class="{'border-danger': $v.surname.$dirty && !$v.surname.required}"><i class="fa fa-address-card" aria-hidden="true"></i></span> 
            </div>
          </div>
          <small v-if="$v.surname.$dirty && !$v.surname.required" class="text-danger">Ообязательное поле</small>
        </div>
        <div class="margin">
          <input class="form-control" 
            :class="{'border-danger': $v.name.$dirty && !$v.name.required}" 
            type="text" 
            name="name" 
            placeholder="Имя" 
            v-model="name">
          <small v-if="$v.name.$dirty && !$v.name.required" class="text-danger">Ообязательное поле</small>
        </div>
        <div class="margin">
          <input class="form-control" type="text" name="patronymic" placeholder="Отчество" v-model="patronymic">
        </div>
        <div class="margin inputDate">
          <flat-pickr name="birthDate" 
            :class="{'border-danger': $v.birthDate.$dirty && !$v.birthDate.required}"
            :config="formDateConfig" 
            v-model="birthDate" 
            placeholder="Дата рождения" 
            class="form-control"></flat-pickr>
          <small v-if="$v.birthDate.$dirty && !$v.birthDate.required" class="text-danger">Ообязательное поле</small>
        </div>
        <div class="margin">
          <select name="region"
            :class="{'border-danger': ($v.region.$dirty && !$v.region.required) || ($v.region.$dirty && $v.region.$error)}"
            class="form-control" 
            v-model="region"
            @change="$v.region.$touch()">
            <option>
              Регион проживания
            </option>
            <option v-for="reg in regions" :key="reg.i" :value="{id: reg.id, region: reg.region}">
              {{reg.region}}
            </option>
          </select>
          <small v-if="($v.region.$dirty && !$v.region.required) || ($v.region.$dirty && $v.region.$error)" class="text-danger">Выбирете регион</small>
        </div>
        <div class="form-group form-check margin">
          <input type="checkbox" class="form-check-input" id="isPassportData" v-model="passChecked">
          <label class="form-check-label" for="isPassportData">Паспортные данные</label>
        </div>
        <div class="form-group" v-if="passChecked">
          <div class="margin">
            <div class="input-group">
              <input class="form-control inputIcon"
                :class="{'border-danger': ($v.seriesAndNumber.$dirty && !$v.seriesAndNumber.required) || ($v.seriesAndNumber.$dirty && $v.seriesAndNumber.$error)}"
                type="text" name="seriesAndNumber" 
                v-mask="'## ## ######'" 
                placeholder="Серия и номер паспорта" 
                v-model="seriesAndNumber">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-lock" aria-hidden="true"></i></span>
              </div>
            </div>
            <small v-if="($v.seriesAndNumber.$dirty && !$v.seriesAndNumber.required) || ($v.seriesAndNumber.$dirty && $v.seriesAndNumber.$error)" class="text-danger">Ообязательное поле</small>
          </div>
          <div class="margin inputDate">
            <div class="input-group">
              <flat-pickr name="issueDate"
                :class="{'border-danger': $v.issueDate.$dirty && !$v.issueDate.required}"
                :config="formDateConfig" 
                v-model="issueDate" 
                placeholder="Дата выдачи" 
                class="form-control inputIcon"></flat-pickr>
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-lock" aria-hidden="true"></i></span>
              </div>
            </div>
            <small v-if="$v.issueDate.$dirty && !$v.issueDate.required" class="text-danger">Ообязательное поле</small>
          </div>
        </div>
        <div class="form-group form-check acceptCheck margin">
          <input type="checkbox" class="form-check-input" id="isAcceptCheck" @change="$v.isAcceptCheck.$touch()" v-model="isAcceptCheck">
          <label class="form-check-label" for="isAcceptCheck">
            Согласен с <a href="#" @click="showPolitics()">политикой о персональных данных</a> и принимаю 
            <a href="#" @click="showOffer()">оферту</a>
          </label>
          <div>
            <small v-if="$v.isAcceptCheck.$dirty && $v.isAcceptCheck.$error" class="text-danger">Чтобы продолжить, установите этот флажок</small>
          </div>
        </div>
        <button type="submit" class="btn btn-primary form-control">НАЧАТЬ ПРОВЕРКУ</button>
      </form>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import Top from '@/components/Top.vue'
  import Politics from '@/components/modal/Politics.vue';
  import Offer from '@/components/modal/Offer.vue';
  import axios from 'axios'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import {TheMask} from 'vue-the-mask'
  import { required, maxLength, minLength, helpers } from 'vuelidate/lib/validators';
  
  const checkRegion = (value) => {
    return value != "Регион проживания"
  }

  export default {
    components: {
      Top,
      Politics,
      TheMask,
      Offer,
      flatPickr,
    },
    data() {
      return {
        regions: [
          {
            id: "22",
            region: 'Алтайский край'
          },
          {
            id: "28",
            region: 'Амурская область'
          },
          {
            id: "29",
            region: 'Архангельская область'
          },
          {
            id: "30",
            region: 'Астраханская область'
          },
          {
            id: "31",
            region: 'Белгородская область'
          },
          {
            id: "32",
            region: 'Брянская область'
          },
          {
            id: "33",
            region: 'Владимирская область'
          },
          {
            id: "34",
            region: 'Волгоградская область'
          },
          {
            id: "35",
            region: 'Вологодская область'
          },
          {
            id: "36",
            region: 'Воронежская область'
          },
          {
            id: "77",
            region: 'г. Москва'
          },
          {
            id: "79",
            region: 'Еврейская автономная область'
          },
          {
            id: "75",
            region: 'Забайкальский край'
          },
          {
            id: "37",
            region: 'Ивановская область'
          },
          {
            id: "38",
            region: 'Иркутская область'
          },
          {
            id: "7",
            region: 'Кабардино-Балкарская Республика'
          },
          {
            id: "39",
            region: 'Калининградская область'
          },
          {
            id: "40",
            region: 'Калужская область'
          },
          {
            id: "41",
            region: 'Камчатский край'
          },
          {
            id: "9",
            region: 'Карачаево-Черкесская Республика'
          },
          {
            id: "42",
            region: 'Кемеровская область'
          },
          {
            id: "43",
            region: 'Кировская область'
          },
          {
            id: "44",
            region: 'Костромская область'
          },
          {
            id: "23",
            region: 'Краснодарский край'
          },
          {
            id: "24",
            region: 'Красноярский край'
          },
          {
            id: "45",
            region: 'Курганская область'
          },
          {
            id: "46",
            region: 'Курская область'
          },
          {
            id: "47",
            region: 'Ленинградская область'
          },
          {
            id: "48",
            region: 'Липецкая область'
          },
          {
            id: "49",
            region: 'Магаданская область'
          },
          {
            id: "50",
            region: 'Московская область'
          },
          {
            id: "51",
            region: 'Мурманская область'
          },
          {
            id: "83",
            region: 'Ненецкий автономный округ'
          },
          {
            id: "52",
            region: 'Нижегородская область'
          },
          {
            id: "53",
            region: 'Новгородская область'
          },
          {
            id: "54",
            region: 'Новосибирская область'
          },
          {
            id: "55",
            region: 'Омская область'
          },
          {
            id: "56",
            region: 'Оренбургская область'
          },
          {
            id: "57",
            region: 'Орловская область'
          },
          {
            id: "58",
            region: 'Пензенская область'
          },
          {
            id: "59",
            region: 'Пермский край'
          },
          {
            id: "25",
            region: 'Приморский край'
          },
          {
            id: "60",
            region: 'Псковская область'
          },
          {
            id: "1",
            region: 'Республика Адыгея (Адыгея)'
          },
          {
            id: "4",
            region: 'Республика Алтай'
          },
          {
            id: "2",
            region: 'Республика Башкортостан'
          },
          {
            id: "3",
            region: 'Республика Бурятия'
          },
          {
            id: "5",
            region: 'Республика Дагестан'
          },
          {
            id: "6",
            region: 'Республика Ингушетия'
          },
          {
            id: "8",
            region: 'Республика Калмыкия'
          },
          {
            id: "10",
            region: 'Республика Карелия'
          },
          {
            id: "11",
            region: 'Республика Коми'
          },
          {
            id: "91",
            region: 'Республика Крым'
          },
          {
            id: "12",
            region: 'Республика Марий Эл'
          },
          {
            id: "13",
            region: 'Республика Мордовия'
          },
          {
            id: "14",
            region: 'Республика Саха (Якутия)'
          },
          {
            id: "15",
            region: 'Республика Северная Осетия - Алания'
          },
          {
            id: "16",
            region: 'Республика Татарстан (Татарстан)'
          },
          {
            id: "17",
            region: 'Республика Тыва'
          },
          {
            id: "19",
            region: 'Республика Хакасия'
          },
          {
            id: "61",
            region: 'Ростовская область'
          },
          {
            id: "62",
            region: 'Рязанская область'
          },
          {
            id: "63",
            region: 'Самарская область'
          },
          {
            id: "78",
            region: 'Санкт-Петербург'
          },
          {
            id: "64",
            region: 'Саратовская область'
          },
          {
            id: "65",
            region: 'Сахалинская область'
          },
          {
            id: "66",
            region: 'Свердловская область'
          },
          {
            id: "92",
            region: 'Севастополь'
          },
          {
            id: "67",
            region: 'Смоленская область'
          },
          {
            id: "26",
            region: 'Ставропольский край'
          },
          {
            id: "68",
            region: 'Тамбовская область'
          },
          {
            id: "69",
            region: 'Тверская область'
          },
          {
            id: "70",
            region: 'Томская область'
          },
          {
            id: "71",
            region: 'Тульская область'
          },
          {
            id: "72",
            region: 'Тюменская область'
          },
          {
            id: "18",
            region: 'Удмуртская Республика'
          },
          {
            id: "73",
            region: 'Ульяновская область'
          },
          {
            id: "27",
            region: 'Хабаровский край'
          },
          {
            id: "86",
            region: 'Ханты-Мансийский автономный округ - Югра'
          },
          {
            id: "74",
            region: 'Челябинская область'
          },
          {
            id: "20",
            region: 'Чеченская Республика'
          },
          {
            id: "21",
            region: 'Чувашская Республика - Чувашия'
          },
          {
            id: "87",
            region: 'Чукотский автономный округ'
          },
          {
            id: "89",
            region: 'Ямало-Ненецкий автономный округ'
          },
          {
            id: "76",
            region: 'Ярославская область'
          }
        ],
        passChecked: false,
        surname: null,
        name: null,
        patronymic: null,
        birthDate: null,
        birthDateFormat: null,
        region: "Регион проживания",
        seriesAndNumber: null,
        issueDate: null,
        issueDateFormat: null,
        isAcceptCheck: false,
        formDateConfig: {
          dateFormat: "d.m.Y",
          maxDate: new Date()
        },
        product: null
      }
    },
    validations() {
      if (this.passChecked) {
        return {
          surname: {
            required
          },
          name: {
            required
          },
          birthDate: {
            required
          },
          region: {
            required,
            checkRegion
          },
          seriesAndNumber: {
            required,
            minLength: minLength(12)
          },
          issueDate: {
            required
          },
          isAcceptCheck: {
            checked(val) {
              return val;
            }
          }
        }
      } else {
        return {
          surname: {
            required
          },
          name: {
            required
          },
          birthDate: {
            required
          },
          region: {
            required,
            checkRegion
          },
          isAcceptCheck: {
            checked(val) {
              return val;
            }
          }
        }
      }
    },
    methods: {
      showPolitics() {
        this.$modal.show(
          Politics, {}, {
            height: '760px'
        })
      },
      showOffer() {
        this.$modal.show(
          Offer, {}, {
            height: '760px'
        })
      },
      submitFillingForm() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }

        const birthDate = this.birthDate.split('.')
        this.birthDateFormat = birthDate[2] + "-" + birthDate[1] + "-" + birthDate[0]

        if (this.passChecked) {
          const issueDate = this.issueDate.split('.')
          this.issueDateFormat = issueDate[2] + "-" + issueDate[1] + "-" + issueDate[0]
        }

        axios.get('https://api-test.realtycloud.ru/products')
        .then(response => {
          let data = response.data.data

          for (let i = 0; i < data.length; i++) {
            if (data[i].product_name == "CheckOwner") {
              this.product = data[i]
            }
          }

          const result = {
            user: {
              surname: this.surname,
              name: this.name,
              patronymic: this.patronymic,
              passChecked: this.passChecked,
              birthDate: this.birthDate,
              birthDateFormat: this.birthDateFormat,
              region: this.region,
              name: this.name,
            },
            product: this.product
          }

          if (this.passChecked) {
            result.user.passport = {
              number: this.seriesAndNumber,
              issueDate: this.issueDate,
              issueDateFormat: this.issueDateFormat
            }
          }

          this.$emit('userInfo', result)
        });
      }
    },
  }
</script>

<style lang="scss" scoped>
  .btn-primary {
    background-color: #409eff;
    border-color: #409eff;
  }
  .text-primary {
    color: #409eff
  }
  section {
    width: 360px;
    background-color: #293fcc;
    margin: 0 auto;
    h4 {
      padding-top: 0px;
    }
    form {
      padding: 15px;
      label, a {  
        color: #fff;
      }
      a {
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
      .margin { 
        margin-bottom: 26px;
        span {   
          background-color: #fff;
          border: 1px solid #ced4da;
          border-radius: .25rem;
          border-left: none;
          color: #90969b;
        }
        small {
          position: absolute;
        }
      }
      .inputIcon {
        border-right: none;
      }
    }
  }
</style>