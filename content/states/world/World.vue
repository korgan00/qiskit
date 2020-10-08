<template>
  <div class="events-world-component">
    <canvas id="glcanvas" width="640" height="480" />
    <div id="LocationData" class="location-data hidden">
      <span>Location name</span>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        In rutrum tellus eget lacus blandit sodales.
        Maecenas vitae eleifend felis, vel ultrices mi.
        Nulla tincidunt sagittis commodo.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { EventsWorldRenderer } from './src/EventsWorld'

@Component
export default class extends Vue {
  mounted () {
    const canvas: HTMLCanvasElement | null = document.querySelector('#glcanvas')

    if (canvas) {
      const eventsWorld: EventsWorldRenderer = new EventsWorldRenderer(canvas, () => {})
      eventsWorld.Run()
    }
  }
}

</script>

<style lang="scss" scoped>
.location-data {
  display: block;
  position: absolute;
  font-size: 1em;
  width: 200px;
  top: 100px;
  right: 20px;
  background-color: white;
  border: 3px solid #CCCCFF;
  border-radius: 5px;
  padding: 15px 10px;
}
.location-data.hidden {
  display: none;
}
.events-world-component {
  top: 100px;
  left: 100px;
  width: 640px;
  display: block;
  position: relative;
}
</style>
