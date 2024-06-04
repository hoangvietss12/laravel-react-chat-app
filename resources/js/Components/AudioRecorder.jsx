import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function AudioRecorder({fileReady}) {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);

    const onMicrophoneClick = async () => {
        if(recording) {
            setRecording(false)
            if(mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }

            return;
        }

        setRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const newMediaRecorder = new MediaRecorder(stream);
            const chucks = [];

            newMediaRecorder.addEventListener("dataavailable", (e) => {
                chucks.push(e.data);
            });

            newMediaRecorder.addEventListener("stop", (e) => {
                let audioBlob = new Blob(chucks, {
                    type: "audio/ogg; codecs=opus",
                });

                let audioFile = new File([audioBlob], "recorded_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });

                const url = URL.createObjectURL(audioFile);
                fileReady(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        }catch(err) {
            setRecording(false);
        }
    }

    return (
        <button
            onClick={onMicrophoneClick}
            className="p-1 text-blue-400 hover:text-blue-200"
        >
            {recording
                ? <StopCircleIcon className="w-6 text-red-600" />
                : <MicrophoneIcon className="w-6" />
            }
        </button>
    );
}
