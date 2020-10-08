// =============================================================================
// Quantum States and Qubits
// =============================================================================


import '../shared/shared';
import { Step } from '../shared/types';
import { EventsWorldRenderer } from './world/src/EventsWorld'
//import Vue from 'vue'

let eventsWorld: EventsWorldRenderer | null;

const canvas: HTMLCanvasElement | null = document.querySelector('#glcanvas')

if (canvas) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  eventsWorld = new EventsWorldRenderer(canvas, () => {})
  eventsWorld.Run()
}

export function atomsOfComputation1($step: Step) {
  $step.model.nextPoint = () => {
    //const idx: number = document.querySelector("#evIdx")
    eventsWorld?.nextPoint()
  }
}
