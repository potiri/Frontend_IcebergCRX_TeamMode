<template>
  <div>
    <form @submit.prevent="validateInput">
      <div class="mr-2 blank-wrapper">
        <!-- display of task content prior to final submission -->
        <div v-if="!this.blank.rightTry && triesLeft > 0 && !completedBefore">
          <div class="message is-primary block">
            <div
              class="message-header title is-uppercase is-5"
              v-html="this.blank.responseActionID"
            ></div>
            <div class="message-body">
              <div class="has-text-dark has-text-weight-medium">
                <div class="block">
                  <span v-html="this.blank.responseActionInstruction"></span>
                </div>
                <div class="block" v-if="blank.isTerminalTask">
                  <terminal :termData="blank" :userPseudonym="this.userPseudonym"></terminal>
                </div>
                <div class="block">
                  <span>&#10140;</span>
                  <span v-html="this.blank.flagInstruction"></span>
                </div>
              </div>

              <div class="buttons is-left mt-5">
                <button
                  class="button is-rounded is-warning has-tooltip-arrow has-tooltip-multiline has-tooltip-top"
                  v-if="!hintActivated && this.blank.hint != null"
                  :data-tooltip="'Buy hint for -1 Point'"
                  @click="buyHint"
                >Need a hint?</button>
              </div>
            </div>
          </div>
        </div>

        <!-- display of task content after completion -->
        <div class="message is-size-5" v-else>
          <div class="message-body">
            <div class="block title is-uppercase is-5" v-html="this.blank.responseActionID"></div>
            <div class="block">
              <span v-html="this.blank.responseActionInstruction"></span>
            </div>

            <div class="block">
              <span>&#10140;</span>
              <span v-html="this.blank.flagInstruction"></span>
            </div>
            <div class="block">
              <span>&#x2139;</span> The correct flag is:
            </div>
            <input
              class="input blank-input is-short is-json is-size-8"
              :value="this.blank.flag"
              readonly
            />
          </div>
        </div>
      </div>

      <br />
      <!-- display messages regarding submitted user input -->
      <div>
        <div class="message is-danger" v-if="emptyInput">
          <div class="message-body">Input cannot be empty.</div>
        </div>
        <div
          class="message is-danger"
          v-else-if="triesLeft < 3 && triesLeft > 0 && !completedBefore && !this.blank.rightTry"
        >
          <div class="message-body">You were wrong. You have {{ triesLeft }} attempts left.</div>
        </div>
        <div v-else-if="this.blank.rightTry">
          <div class="message is-success">
            <div class="message-body is-size-5">Good on you! You earned {{ triesLeft }} point(s). 🎉</div>
          </div>
          <div class="message is-warning" v-if="this.blank.isTerminalTask">
            <div class="message-body is-size-5">
              The correct command is:
              <span
                class="is-family-monospace has-background-light"
                v-html="this.blank.correctCommand"
              ></span>
            </div>
          </div>
          <div class="message is-link" v-if="this.blank.level == 6">
            <div class="message-body is-size-5">
              Before you continue with the
              <span class="has-text-weight-bold">final task,</span> take a breath and hit the
              <span class="has-text-weight-bold">'Refresh'</span> button in the SIEM dashboard.
            </div>
          </div>
        </div>
        <div v-else-if="triesLeft == 0 && this.blank.wrongTry">
          <div class="message is-danger">
            <div class="message-body">Sorry. You have no attempts left.</div>
          </div>
          <div class="message is-warning" v-if="this.blank.isTerminalTask">
            <div class="message-body is-size-5">
              The correct command is:
              <span
                class="is-family-monospace has-background-light"
                v-html="this.blank.correctCommand"
              ></span>
            </div>
          </div>
          <div class="message is-link" v-if="this.blank.level == 6">
            <div class="message-body is-size-5">
              Before you continue with the
              <span class="has-text-weight-bold">final task,</span> take a breath and hit the
              <span class="has-text-weight-bold">'Refresh'</span> button in the SIEM dashboard.
            </div>
          </div>
        </div>
      </div>
      <br />
      <!-- display hint -->
      <div class="message is-warning" v-if="hintActivated">
        <div class="message-body">
          Hint:
          <span v-html="this.blank.hint"></span> (-1 point)
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Terminal from "./Terminal.vue";

export default {
  name: "Blank",

  components: {
    Terminal,
  },

  props: {
    blankData: {
      required: true,
    },
    index: {},
    tileNo: {},
    userPseudonym: {},
    completedBefore: {},
    userLevel: null,
  },

  data() {
    return {
      blank: this.blankData,
      userInput: "",
      hintActivated: false,
      emptyInput: false,
      triesLeft: this.getTriesLeft(),
      points: null,
    };
  },

  methods: {
    getTriesLeft() {
      if (this.userLevel > this.blankData.level) {
        return 0;
      } else if (localStorage.getItem("storedTries") != null) {
        return JSON.parse(localStorage.getItem("storedTries"))[
          this.blankData.level
        ];
      } else {
        return 3;
      }
    },
    buyHint() {
      this.$emit("buy-hint");
      this.hintActivated = true;
    },
    completed() {
      if (this.triesLeft > 0 && !this.blank.rightTry) {
        return false;
      }
      return true;
    },
    validateInput() {
      if (this.userInput == "") {
        this.emptyInput = true;
      } else if (!this.blank.flagVariants.includes(this.userInput.trim())) {
        this.emptyInput = false;
        this.triesLeft -= 1;
        try {
          var allTries = JSON.parse(localStorage.getItem("storedTries"));
          console.log("all tries", allTries);
          allTries[this.blankData.level] = allTries[this.blankData.level] - 1;
          localStorage.setItem("storedTries", JSON.stringify(allTries));
          console.log("localStorage", localStorage);
        } catch (err) {
          console.log("localStorage empty");
        }

        this.blank.wrongTry = true;
      } else {
        this.emptyInput = false;
        this.blank.rightTry = true;
        this.blank.wrongTry = false;
        this.hintActivated = false;
        try {
          //evtl noch anpassen
          var allTries2 = JSON.parse(localStorage.getItem("storedData"));
          allTries2[this.tileNo][this.index] = 0;
          localStorage.setItem("storedData", JSON.stringify(allTries2));
        } catch (err) {
          console.log("localStorage empty");
        }
      }
      if (this.completed()) {
        this.points = this.triesLeft;
        this.$emit("blank-completed", this.points); //the trainee gets as many points for the blank as he or she has tries left
        this.$emit("tries-count", this.triesLeft);
      }
      this.userInput = "";
    },
  },

  computed: {},
};
</script>
