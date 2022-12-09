<template>
<body>
  <div>
    <!-- layout prior exercise: prompts user to login -->
    <div v-if="!gameStarted" class="is-vhcentered has-text-centered">
      <img class="image is-hcentered" style="width: 100px" src="./assets/iceberg.png" />

      <div v-if="!VMAssigned" class="is-json title mt-6 pt-6">
        Welcome to ICEBERG! gh test
        <div class="subtitle mb-6 pb-6">A Cyber Range for Incident Response Training.</div>
      </div>

      <div class="margin-big has-text-centered">
        <form @submit.prevent="validateId()">
          <div class="field">
            <span>
              <input class="input input-label-short is-size-6" :value="'Your ' + naming + ': '" />
            </span>
            <span>
              <input
                class="input input-short is-size-6 blank-input"
                v-model.trim="userID"
                :placeholder="namingPlaceholder"
              />
            </span>
          </div>

          <div class="has-text-danger" v-if="emptyInput">User ID cannot be empty.</div>
          <div class="has-text-danger" v-if="wrongUserID">User ID is not registered.</div>

          <div class="buttons is-centered mt-5">
            <button
              class="button submit-button is-large is-rounded mt-5"
              type="submit"
              value="Submit"
              @click="validateId()"
            >
              <span>START</span>
            </button>
          </div>
        </form>
      </div>
      <h2 class="is-json subtitle mb-6">A research project of the University of Regensburg. 🎓</h2>
    </div>

    <!-- layout post exercise: informs user about completion exercise -->
    <div v-if="gameCompleted" class="is-vhcentered has-text-centered">
      <h1 class="is-json title mt-5">Congrats team {{ String(this.userPseudonym) }}!</h1>

      <h2 class="subtitle mb-2">
        You completed the exercise with
        <strong>{{ this.points }} points</strong>. This was great teamwork! Thanks to your efforts the impact of the MitM attack on the filling plant were minimal.
      </h2>

      <br />

      <br />
      <h2 class="subtitle is-10">
        To complete the cyber range training please take part in our
        <strong>final quiz</strong>
        and let one of the trainers know when you finished.
        Please use again your
        {{naming}}
        <strong
          class="title is-json"
        >({{namingPlaceholder}})</strong> to register for the
        quiz.
      </h2>
      <!--CHANGE back-->

      <div class="buttons is-centered pt-3">
        <button
          class="button submit-button is-large is-rounded"
          type="submit"
          value="Submit"
          @click="
                //proceedToQuiz();
                showFinalQuiz=true"
          v-if="!showFinalQuiz"
        >
          <span>Final Quiz &#10140;</span>
        </button>
      </div>

      <iframe
        v-if="showFinalQuiz"
        :src="urlPostQuiz"
        style="display: block; width: 100%; height: 50vh"
        class="pt-6 pb-6"
      ></iframe>

      <div v-if="showFinalQuiz" class="pb-6">
        Nothing to see? Click
        <strong>
          <a class="has-text-link" :href="urlPostQuiz" target="_blank">
            <u>here</u>
          </a>
        </strong> and let the trainer know when you have finished.
      </div>
    </div>

    <!-- comment -->
    <!-- layout during exercise: provides user with the exercise units to progress through -->
    <div v-if="gameStarted && !gameCompleted">
      <head>
        <meta charset="UTF-8" />
        <title>cr</title>
      </head>

      <!-- main container dividing the layout of the front end in two parts
          - a) the kibana dashboard including an 
            - additional navigation bar with 
              - a scoreboard and and 
              - feature to display the kibana dashboard in fullscreen
          - b) the learning material consisting of the introductory video and the three exercise units 
      -->
      <div class="columns">
        <!-- Part 1: the kibana dashboard including a navigation bar -->
        <div class="column is-fixed is-full" :class="{ 'is-half': !fullscreen }">
          <!-- kibana dashboard -->
          <section v-if="kibanaOn">
            <figure class="pb-5">
              <iframe :src="kibanaUrl" style="display: block; width: 100%; height: 100vh"></iframe>
            </figure>
          </section>

          <!-- navigation bar 
          with scoreboard and feature to display the kibana dashboard in fullscreen-->
          <nav
            class="navbar is-fixed-bottom is-transparent mb-1"
            v-if="gameStarted && !gameCompleted"
          >
            <div class="navbar-brand navbar-background is-half">
              <div class>
                <!-- implementation of the scoreboard -->
                <div class="navbar-brand" v-if="!hideScoreboard">
                  <table class="table is-size-7 has-text-white dashboard mt-1 mb-1" width="100%">
                    <tbody class="pt-0 has-text-white">
                      <tr class="has-text-white">
                        <th class="has-text-white">Rank</th>
                        <th class="has-text-white">Username</th>
                        <th class="has-text-white">Points</th>
                        <th class="has-text-white">Level</th>
                      </tr>
                      <tr
                        v-for="(item, index) in dashboard"
                        :key="item"
                        :class="{
                            'has-text-primary has-text-weight-bold':
                              item.userID == this.userID,
                          }"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.pseudonym }}</td>
                        <td>{{ item.points }}</td>
                        <td>{{ item.level }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- implementation of the buttons 
                        - to hide/show the scoreboard 
                        - to enable/disable fullscreen mode for the kibana dashboard
                -->
                <div id="navbarBasicExample" class="navbar-menu">
                  <div class="buttons is-left">
                    <button
                      class="button is-primary is-static is-small has-background-primary has-text-white"
                    >
                      <strong>Points: {{ points }}</strong>
                    </button>

                    <button class="button is-primary is-small is-static">
                      <strong>Level: {{ this.level }}</strong>
                    </button>

                    <button
                      class="button show-button is-small has-tooltip-arrow has-tooltip-multiline has-tooltip-top"
                      @click="(fullscreen = true), (hideScoreboard = true), rememberScrollPos()"
                      :data-tooltip="'Show SIEM dashboard in fullscreen'"
                      v-if="!fullscreen"
                    >
                      <font-awesome-icon :icon="['fa', 'expand']" />
                    </button>

                    <button
                      class="button show-button is-small has-tooltip-arrow has-tooltip-multiline has-tooltip-top"
                      @click="(fullscreen = false), (hideScoreboard = false), scrollBack()"
                      :data-tooltip="'Split display and show exercise units'"
                      v-else
                    >
                      <font-awesome-icon :icon="['fa', 'compress']" />
                    </button>

                    <button
                      class="button show-button is-small has-tooltip-arrow has-tooltip-multiline has-tooltip-top"
                      @click="this.hideScoreboard = true"
                      :data-tooltip="'Hide scoreboard'"
                      v-if="!hideScoreboard"
                    >&#128469;</button>

                    <button
                      class="button show-button is-small has-tooltip-arrow has-tooltip-multiline has-tooltip-top"
                      @click="this.hideScoreboard = false"
                      :data-tooltip="'Show scoreboard'"
                      v-else
                    >&#128470;</button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Part 2: the actual exercise 
        comprising the the introductory video and the two/three exercise units-->
        <div class="column right is-half" v-if="!fullscreen">
          <!-- <glossary :order="this.order"></glossary> --->

          <!-- introductory video --->
          <video-intro
            :videoData="VideoData[0]"
            :order="this.order"
            @start-playbook-one="this.startPlaybookOne = true"
          ></video-intro>

          <!-- Unit 1 / Playbook 1 --->
          <div id="playbookOne">
            <div class="is-info content" v-if="this.startPlaybookOne || this.level > 0">
              <div class="has-text-link-dark has-text-left title is-3 is-json">Playbook 1</div>
              <div class="subtitle nice-subtitle">Introduction to Incident Response</div>

              <div class="is-info content" id="prepOne">
                <div class="has-text-link-dark has-text-left title is-4 is-json">Preparation Phase</div>

                <situational-awareness-1 :order="this.order"></situational-awareness-1>
                <div>
                  <video-tile :videoData="VideoData[1]" :order="this.order"></video-tile>

                  <text-lesson-1 :order="this.order"></text-lesson-1>
                </div>
              </div>

              <div class="is-info content" id="identOne">
                <div
                  class="has-text-link-dark has-text-left title is-4 is-json"
                >Identification Phase</div>
                <!-- doc on Vue.js
                            '<flag-submission' represents the component stored in './components/FlagSubmission.vue'
                            ':taskData=Task1_1' passes down the data stored in './data/task1_1.js' to the component's prop 'taskData'
                            'order="this.order"' passes down the the variable 'order' stored in this file to the component's prop 'order'
                            '@submit-points="submitPoints"' listens for the component's broadcast 'submit-points' and 
                            calls the function 'submitPoints()' in this file
                            '@task-completed="markAsCompleted"' listens for the component's broadcast 'task-completed' and 
                            calls the function 'markAsCompleted()' in this file
                --->
                <div>
                  <flag-submission
                    :taskData="Unit1IdentTasks"
                    :order="this.order"
                    :tasksCompleted="tasksCompleted"
                    :userPseudonym="this.userPseudonym"
                    :userLevel="this.level"
                    @submit-points="submitPoints"
                    @task-completed="markAsCompleted"
                    @ident-one-completed="this.startRespOne = true"
                    @get-marker="getUserPoints"
                  ></flag-submission>
                </div>
              </div>

              <div id="respOne">
                <div class="is-info content" v-if="this.startRespOne || this.level > 1">
                  <div class="has-text-link-dark has-text-left title is-4 is-json">Response Phase</div>
                  <div
                    class="block has-text-weight-medium is-size-5"
                  >You've finished your first incident response playbook! As this was a test alarm, there's no need for response actions.</div>
                  <div class="block has-text-weight-medium is-size-5">
                    Before you head on to Playbook 2, quickly hit the
                    <span
                      class="has-text-weight-bold"
                    >'Refresh'</span> button in the SIEM dashboard to get the latest events.
                  </div>
                  <!-- display buttons Continue and Show/Hide to 
                                    - continue to the next lesson/task/unit while hiding the content below the title and subtile, or to
                  - show/hide the content below the title and subtitle-->
                  <div class="buttons is-left mt-5">
                    <button
                      class="button is-rounded submit-button is-large"
                      @click="this.startPlaybookTwo = true; this.scrollToPlaybookTwo()"
                    >
                      <span>&#9655;</span> Start with Playbook 2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Unit 2 / Playbook 2 --->
          <div id="playbookTwo">
            <div class="is-info content" v-if="startPlaybookTwo || this.level > 2">
              <div class="has-text-link-dark has-text-left title is-3 is-json">Playbook 2</div>
              <div class="subtitle nice-subtitle">Responding to a MitM attack</div>

              <div class="is-info content" id="prepTwo">
                <div class="has-text-link-dark has-text-left title is-4 is-json">Preparation Phase</div>
                <div>
                  <situational-awareness-2 :order="this.order"></situational-awareness-2>
                  <video-tile :videoData="VideoData[2]" :order="this.order"></video-tile>
                  <text-lesson-2 :order="this.order"></text-lesson-2>
                </div>
              </div>

              <div class="is-info content" id="identTwo">
                <div
                  class="has-text-link-dark has-text-left title is-4 is-json"
                >Identification Phase</div>

                <div>
                  <flag-submission
                    :taskData="Unit2IdentTasks"
                    :order="this.order"
                    :tasksCompleted="tasksCompleted"
                    :userPseudonym="this.userPseudonym"
                    :userLevel="this.level"
                    @submit-points="submitPoints"
                    @task-completed="markAsCompleted"
                    @ident-two-completed="this.startRespTwo = true"
                    @get-marker="getUserPoints"
                  ></flag-submission>
                </div>
              </div>

              <div id="respTwo">
                <div class="is-info content" v-if="this.level >= 4">
                  <div class="has-text-link-dark has-text-left title is-4 is-json">Response Phase</div>
                  <flag-submission
                    :taskData="Unit2RespTasks"
                    :order="this.order"
                    :tasksCompleted="tasksCompleted"
                    :userPseudonym="this.userPseudonym"
                    :userLevel="this.level"
                    @submit-points="submitPoints"
                    @task-completed="markAsCompleted"
                    @game-finished="this.finishGame"
                    @get-marker="getUserPoints"
                  ></flag-submission>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</template>


<script>
// import Glossary from "./components/Glossary.vue";
import VideoIntro from "./components/VideoIntro.vue";
import VideoTile from "./components/VideoTile.vue";
import SituationalAwareness1 from "./components/SituationalAwareness1.vue";
import SituationalAwareness2 from "./components/SituationalAwareness2.vue";
import TextLesson1 from "./components/TextLesson1.vue";
import TextLesson2 from "./components/TextLesson2.vue";

import FlagSubmission from "./components/FlagSubmission.vue";

import VideoData from "./data/video_data.js";
import Unit1IdentTasks from "./data/Unit1IdentTasks.js";
import Unit2IdentTasks from "./data/Unit2IdentTasks.js";
import Unit2RespTasks from "./data/Unit2RespTasks.js";
import settings from "./Settings.js";

import { userDashboard } from "@/firebase";
import { VM_db } from "@/firebase";
export default {
  name: "App",

  components: {
    //   Glossary,
    VideoIntro,
    VideoTile,
    SituationalAwareness1,
    SituationalAwareness2,
    TextLesson1,
    TextLesson2,
    FlagSubmission,
  },

  data() {
    return {
      VideoData: VideoData,
      Unit1IdentTasks: Unit1IdentTasks,
      Unit2IdentTasks: Unit2IdentTasks,
      Unit2RespTasks: Unit2RespTasks,

      order: [
        "video1",
        "playbookOne",
        "video2",
        "video3",
        "textlesson1",
        "identOne",
        "unit1Ident",
        "respOne",
        "playbookTwo",
        "sa2",
        "video4",
        "textlesson2",
        "identTwo",
        "unit2Ident",
        "respTwo", //TODO, was ist das?
        "unit2Resp",
      ],

      startPlaybookOne: false,
      startRespOne: false,
      startPlaybookTwo: false,
      startRespTwo: false,
      gameCompleted: false,
      gameStarted: false,
      userID: null,
      taskTimes: [],
      tries: [],
      startTime: null,
      evaluationData: [],
      dashboard: null,
      points: null,
      level: null,
      round: null,
      wrongUserID: false,
      showFinalQuiz: false,
      tasksCompleted: 0,
      emptyInput: false,
      fullscreen: false,
      hideScoreboard: false,
      scrollPos: null,
      userPseudonym: null,
      kibanaOn: true,
      urlPostQuiz: settings.urlPostQuiz,
      naming: settings.naming,
      namingPlaceholder: settings.namingPlaceholder,
      loginDisabled: settings.loginDisabled,
      kibanaUrl:
        window.location.href.replace("7080", "5605") +
        "app/kibana#/dashboard/350e16e0-38b3-11ec-a547-a7b24e1b3b31?_g=(refreshInterval:(pause:!f,value:90000),time:(from:now-2h,to:now))&_a=(description:'Kibana%20dashboard%20for%20DSIEM',filters:!(),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(title:'Timeline%20%26%20Count%20of%20Events%20and%20Alarms'),gridData:(h:9,i:'9',w:36,x:12,y:0),id:b4844b80-b45c-11e8-b3e4-11404c6637fe,panelIndex:'9',title:'Timeline%20%26%20Count%20of%20Events%20and%20Alarms',type:visualization,version:'7.6.1'),(embeddableConfig:(title:Alarms,vis:(defaultColors:('0%20-%2020':'rgb(0,104,55)','20%20-%2050':'rgb(255,255,190)','50%20-%20100':'rgb(165,0,38)'),legendOpen:!t)),gridData:(h:9,i:'10',w:12,x:0,y:0),id:'217b62e0-b45e-11e8-b3e4-11404c6637fe',panelIndex:'10',title:Alarms,type:visualization,version:'7.6.1'),(embeddableConfig:(columns:!(category,title,sensor,src_ip,dst_ip,plugin_sid),title:'Event%20Overview'),gridData:(h:17,i:'14',w:48,x:0,y:25),id:c7aa9f10-e365-11e8-9c9b-556fd2a389b2,panelIndex:'14',title:'Event%20Overview',type:search,version:'7.6.1'),(embeddableConfig:(columns:!(title,risk_class,category,kingdom),title:'Alarm%20Overview'),gridData:(h:16,i:'15',w:48,x:0,y:9),id:'334c77b0-b338-11e8-b3e4-11404c6637fe',panelIndex:'15',title:'Alarm%20Overview',type:search,version:'7.6.1')),query:(language:lucene,query:''),timeRestore:!t,title:SIEM_IR,viewMode:view)",
    };
  },

  mounted() {
    this.url_param = new URL(location.href).searchParams.get("userID");
    if (this.loginDisabled) {
      this.userID = "testUser";
      this.gameStarted = true;
    } else if (this.loginDisabled) {
      this.gameStarted = true;
    } else if (this.url_param != null) {
      this.userID = this.url_param;
      //var newUrl = this.removeURLParameter(location.href, "userID");
      //history.pushState({}, null, newUrl);
      this.validateId();
    } else {
      console.log("url is empty");
    }
  },

  computed: {
    mitmRunning() {
      if (this.level == 2) {
        this.makeAPICall("start_mitm");
        return true;
      } else if (this.level == 7) {
        this.makeAPICall("stop_mitm");
        return false;
      }
      return false;
    },
  },

  methods: {
    validateId() {
      //this.makeAPICall("start_mitm"); //hier funktionierts

      if (this.userID == null) {
        this.emptyInput = true;
      } else {
        var docRef = userDashboard.doc(String(this.userID));
        docRef.get().then((doc) => {
          if (doc.exists) {
            this.emptyInput = false;
            this.gameStarted = true;

            this.getUserPoints();
            window.scrollTo(0, document.body.scrollHeight);
            //this.restartDigitalTwinContainer();   // restarts the digital twin docker container via the Flask
          } else {
            this.wrongUserID = true;
          }
        });
      }

      window.onbeforeunload = function () {
        return "Data will be lost if you leave the page, are you sure?";
      };
    },

    removeURLParameter(url, parameter) {
      //prefer to use l.search if you have a location/link object
      var urlparts = url.split("?");
      if (urlparts.length >= 2) {
        var prefix = encodeURIComponent(parameter) + "=";
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0; ) {
          //idiom for string.startsWith
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1);
          }
        }

        return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
      }
      return url;
    },

    restartDigitalTwinContainer() {
      this.$http
        .get(
          window.location.href.replace("7080", "9090") + "restart_dt_container"
        )
        .then((response) => {
          console.log(response.data);
        });
    },

    getUnits: function () {
      if (this.$route.query.userID != null) {
        this.userID = this.$route.query.userID;
        this.validateId();
        console.log("found url");
      } else {
        console.log("url is empty");
      }
    },
    beforeMount() {
      this.getUnits();
    },

    getUserPoints() {
      var docRef = userDashboard.doc(String(this.userID));

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.round = doc.data().round; //in order to only show the trainees from the same round on the dashboard
            if (doc.data().startTime != null) {
              //get data from user who logged in before
              this.points = doc.data().points;
              this.level = doc.data().level;
              this.startTime = doc.data().startTime;
              this.userPseudonym = doc.data().pseudonym;
              this.level = doc.data().level;
              console.log(this.mitmRunning);
              if (this.level > 4) {
                this.playbookTwoBegin = true;
              }
              if (doc.data().taskTimes != null) {
                this.taskTimes = JSON.parse(doc.data().taskTimes);
              }
            } else {
              //registered player who didn't log in before
              console.log(doc.data().startTime);
              this.level = 0;
              this.startTime = new Date();
              this.userPseudonym = doc.data().pseudonym;
              userDashboard.doc(this.userID).update({
                startTime: this.startTime,
              });

              var storedTries = [3, 3, 3, 3, 3, 3, 3, 3];
              var blanksCompleted = {
                unit1Ident: 0,
                unit2Ident: 0,
                unit2Resp: 0,
              };
              localStorage.setItem("storedTries", JSON.stringify(storedTries));
              localStorage.setItem(
                "blanksCompleted",
                JSON.stringify(blanksCompleted)
              );
            }
          } else {
            // if not only played with preset users
            this.points = 0;
            this.level = 0;
            this.startTime = new Date();
            userDashboard.doc(this.userID).set({
              startTime: this.startTime,
              round: 1,
              level: 0,
              points: 0,
            });
            console.log(this.getVM());
          }
          this.getMarker();
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },

    async getVM() {
      const snapshot = await VM_db.limit(1).get();
      console.log(snapshot.docs.map((doc) => doc.data()));
      return JSON.stringify(snapshot.docs.map((doc) => doc.data().pseudonym)); //funktioniert so nicht
    },

    async getMarker() {
      const snapshot = await userDashboard
        .where("round", "==", this.round)
        .orderBy("points", "desc")
        .get();
      //const snapshot = await userDashboard.orderBy("points", "desc").get();
      this.dashboard = snapshot.docs.map((doc) => doc.data());
    },

    async uploadPoints() {
      await userDashboard.doc(this.userID).update({
        points: this.points,
        level: this.level,
        startTime: this.startTime,
      });
      this.getMarker();
    },

    async uploadEvaluationData() {
      await userDashboard.doc(this.userID).update({
        taskTimes: JSON.stringify(this.taskTimes),
        tries: JSON.stringify(this.tries),
      });
    },

    /*checkIfNewLevel(newLevel) {
      if (newLevel != this.level_old && newLevel > 1) {
        this.level_old = newLevel;
        return newLevel;
      }
      return this.level_old;
    },*/

    markAsCompleted(taskTimes, tries) {
      //save timer information here
      //this.level += 1;
      //this.uploadPoints();
      this.taskTimes.push(taskTimes);
      this.tries.push(tries);
      this.uploadEvaluationData();
    },

    finishGame() {
      this.gameCompleted = true;
      this.evaluationData.push(
        "ID: " + this.userID,
        "Points: " + this.points,
        "Level: " + this.level,
        "Times: " + this.taskTimes
      );
      this.submitEvaluationData();
      this.uploadEvaluationData();
      console.log("uploaded");
    },

    submitEvaluationData() {
      this.$http
        .post(
          window.location.href.replace("7080", "9090/submit") +
            JSON.stringify(this.evaluationData)
        )
        .then((response) => {
          console.log(response.data);
        });
    },

    scrollBack() {
      setTimeout(() => {
        window.scrollTo(0, this.scrollPos);
      });
    },

    rememberScrollPos() {
      this.scrollPos = window.scrollY;
    },

    makeAPICall(apiPath) {
      this.$http
        .get(window.location.href.replace("7080", "9090") + apiPath)
        .then((response) => {
          console.log(response.data);
        });
    },

    submitPoints(points2) {
      this.points += points2;
      console.log("points now: ", this.points);
      if (points2 >= 0) {
        this.level += 1;
        console.log(this.mitmRunning);
      }

      this.uploadPoints();
    },
    scrollToPlaybookTwo() {
      const el = document.getElementById("playbookTwo");
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", alignToTop: true });
      });
    },
  },
};
</script>


<style>
@import "./../css/bulma.css";
@import "./../css/bulma.min.css";
@import "./../css/bulma-tooltip.css";
</style>