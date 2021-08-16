export type ErrorHandler = (error: string) => void;

class HydraWrapper {
  hydra: any;
  onError: ErrorHandler;

  constructor(canvas: HTMLCanvasElement, onError: ErrorHandler) {
    // eslint-disable-next-line global-require
    const Hydra = require("hydra-synth");
    // eslint-disable-next-line global-require
      const P5 = require("./p5-wrapper");
      require('@tensorflow/tfjs-core');
      require('@tensorflow/tfjs-converter');
      require('@tensorflow/tfjs-backend-webgl');

      const posenet = require('@tensorflow-models/posenet');


      async function estimatePoseOnImage(imageElement) {
          // load the posenet model from a checkpoint
          const net = await posenet.load(P5.canvas);

          const pose = await net.estimateSinglePose(imageElement, {
              flipHorizontal: false
          });
          return pose;
      }

      p = new P5()
      p.createCanvas(100, 100);
      capture = p.createCapture(
          p.VIDEO
      );
      capture.hide();


      const pose = async () => await estimatePoseOnImage(p.canvas);

      window.pose = pose;

      window.worker=setInterval( async () => window.score = await pose(), 500 )

    window.P5 = P5;

    // For some reason on Android mobile, Chrome has this object undefined:
    if (!window.navigator.mediaDevices) return;

    this.hydra = new Hydra({ canvas });
    this.onError = onError || (() => { });
  }

  tryEval = (code: string) => {
    let evalCode: string = code;

    console.debug(evalCode);
    // FIXME Should remove this after this function ends
    window.H = this.hydra;
    try {
      // eslint-disable-next-line no-eval
      eval.call(window, evalCode);
      this.onError(null);
    } catch (error) {
      this.onError(String(error));
    }
  }
}

export default HydraWrapper;
