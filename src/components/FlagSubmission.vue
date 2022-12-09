<template>
  <div class="is-task" :id="this.taskData.tileNo">
    <div v-if="unlockMessage">
      <div class="message is-warning">
        <div class="message-body">
          <span
            class="is-warning is-size-5"
          >You haven't unlocked the next level yet. Submit your flags before proceeding!</span>
        </div>
      </div>
    </div>

    <div v-if="taskCompleted">
      <div class="message is-success">
        <div class="message-body">
          <span class="is-primary-darker is-size-5">You completed the phase, Let's proceed!</span>
        </div>
      </div>
    </div>

    <div class="buttons is-left mt-5">
      <button
        class="button is-rounded is-success"
        @click="this.beginPhase = true; this.trackBegin(); this.scrollToElement(this.taskData.tileNo);"
        v-if="!this.beginPhase "
        button
      >Begin</button>
    </div>
    <div class="is-directive" v-if="beginPhase ">
      <!-- display post task completion: information for the user and buttons to proceed -->
      <div v-if="taskCompleted || completedBefore">
        <div class="is-primary-darker title is-json">Phase completed!</div>

        <!-- display buttons Continue and Show/Hide -->
        <div class="buttons is-left mt-5">
          <!-- TODO update task6 to your final key to show button "Finish Game" -->
          <button
            class="button is-rounded submit-button is-large"
            v-if="this.taskData.tileNo != 'unit2Resp'"
            @click="proceed()"
          >Next Level</button>
          <button
            class="button is-rounded submit-button is-large"
            v-if="this.taskData.tileNo == 'unit2Resp'"
            @click="this.$emit('game-finished')"
          >Finish Game</button>

          <button
            class="button is-rounded is-light is-red-br"
            v-if="!showContent"
            @click="show()"
          >Show tasks</button>
        </div>
      </div>

      <br />

      <!-- display prior task completion: actual task  -->
      <div v-if="showContent ">
        <!-- bind the display style of this element to the truthiness of 'taskCompleted' or 'completedBefore' -->
        <div :class="{ 'directive-completed': taskCompleted || completedBefore }">
          <div class="has-text-weight-medium is-size-5 block" v-html="this.phaseIntroduction"></div>

          <div v-for="(blank, index) in this.blanks" :key="blank">
            <!-- use component Blank.vue with the data from blanks -->
            <blank
              class="pt-4 pb-4"
              :blankData="blank"
              :index="index"
              :tileNo="this.taskData.tileNo"
              :completedBefore="completedBefore"
              :userPseudonym="this.userPseudonym"
              :userLevel="this.userLevel"
              @blank-completed="completeTask"
              @buy-hint="this.$emit('submit-points', -1)"
              @tries-count="storeTries"
            ></blank>
          </div>
        </div>
      </div>
      <div class="buttons is-left mt-5">
        <!-- TODO update task6 to your final key to show button "Finish Game" -->
      </div>
    </div>
    <button
      class="button is-rounded submit-button is-large mt-5"
      v-if="!this.completedBefore"
      @click="unlockNextTask()"
    >Complete Phase</button>
  </div>
</template>


<script>
import Blank from "./Blank.vue";

export default {
  name: "FlagSubmission",

  components: {
    Blank,
  },

  props: {
    taskData: {
      type: Object,
      required: true,
    },
    userPseudonym: {},
    order: {},
    tasksCompleted: {},
    userLevel: {},
  },

  data() {
    return {
      level: this.taskData.level,

      responsePhase: this.taskData.responsePhase,
      phaseIntroduction: this.taskData.phaseIntroduction,

      blanks: this.taskData.blanks,
      blanks_completed: this.getBlanksCompleted(),
      taskCompleted: false,
      pointsOverall: 0,
      timestamps: [],
      storedTries: [],
      //beginPhase: this.getPhase(),
      beginPhase: true,
      showContent: true,
      triesLeft: 0,
      failedOneTask: false,
      unlockMessage: false,
    };
  },

  computed: {
    completedBefore() {
      if (this.level <= this.userLevel) {
        this.showPhaseHeader();

        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    getPhase() {
      if (this.userLevel > this.taskData.blanks[0].level) return true;
      else {
        return false;
      }
    },

    getBlanksCompleted() {
      if (localStorage.getItem("blanksCompleted") != null) {
        console.log(
          "blanks_compl: ",
          JSON.parse(localStorage.getItem("blanksCompleted"))[
            this.taskData.tileNo
          ]
        );
        return JSON.parse(localStorage.getItem("blanksCompleted"))[
          this.taskData.tileNo
        ];
      } else {
        return 0;
      }
    },
    showPhaseHeader() {
      //this.beginPhase = true;
      this.unlockMessage = false;
    },

    trackBegin() {
      this.timestamps = [this.taskData.tileNo, new Date()];
      console.log("begin:", this.timestamps);
    },

    completeTask(points) {
      this.blanks_completed += 1;

      this.$emit("submit-points", points);
      if (points != -1) {
        this.timestamps.push(new Date());
        console.log("new Timestamp: ", new Date());
        this.storedTries.push(points);
        console.log("new Point: ", points);
      }

      this.pointsOverall += points;
      try {
        var allBlanks = JSON.parse(localStorage.getItem("blanksCompleted"));

        allBlanks[this.taskData.tileNo] = allBlanks[this.taskData.tileNo] + 1;

        localStorage.setItem("blanksCompleted", JSON.stringify(allBlanks));
      } catch (err) {
        console.log("localStorage empty");
      }

      if (this.taskData.tileNo == "unit1Ident") {
        this.$emit("ident-one-completed");
      } else if (this.taskData.tileNo == "unit2Ident") {
        this.$emit("ident-two-completed");
      } else if (this.taskData.tileNo == "unit2Resp") {
        this.$emit("resp-two-completed");
      }

      if (this.blanks_completed == Object.keys(this.blanks).length) {
        this.taskCompleted = true;
        /*this.timestamp_after = new Date();
        this.timeToComplete =
          (this.timestamp_after.getTime() - this.timestamp_before.getTime()) /
          1000; */

        this.$emit("task-completed", this.timestamps, this.storedTries);
        this.scrollToElement(this.taskData.tileNo);
      }
    },

    proceed() {
      this.hide();
      var nextSection = this.order.indexOf(this.taskData.tileNo) + 1;
      this.scrollToElement(this.order[nextSection]);
    },

    unlockNextTask() {
      this.unlockMessage = false;
      this.$emit("get-marker");
      console.log("completed: ", this.completedBefore);
      this.scrollToElement(this.taskData.tileNo);
      if (!this.completedBefore) {
        this.unlockMessage = true;
      }
    },

    storeTries(tries) {
      if (tries == 0) {
        this.failedOneTask = true;
      }
      this.triesLeft += tries;
    },

    hide() {
      this.showContent = false;
    },

    show() {
      this.showContent = true;
      this.scrollToElement(this.taskData.tileNo);
    },

    scrollToElement(id) {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", alignToTop: true });
      });
    },
  },
};
</script>