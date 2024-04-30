## Difference between Captions & Subtitles

It's a subtle one, but they are not the same. Captions are generally directed to people with hearing disabilities and specific to how they can interpret sounds via words, whereas subtitles are under the consideration that the person can hear but cannot understand the foreign language the audio is in.

It's really interesting study and how you can also make it more accessible - learnt it from here - [https://web.archive.org/web/20160117160743/http://screenfont.ca/learn/](https://web.archive.org/web/20160117160743/http://screenfont.ca/learn/)

## Adding captions and subtitles to HTML video [^1]

Exploring the WebVTT API and the track tags. Both can be used as per preference. I've yet to implement it as of today (30th April), was exploring this as part of a solution of what to do post subtitle generation from the video.

Previously I would've gone with rendering the subtitles as part of the video, but the problem statement includes that the user can edit these subtitles at a later point. 

Hence a better approach would be to store the subtitles as a .vtt file and feed it into the video tag via tracks. I see this as

1. It saves time to not have to render the video over and over for different subtitles, only the `.vtt` file is enough to be modified.
2. Can be used on both user and customer front, sort of drops the need for a video transcoding tools like `ffmpeg` for now.
3. Saves computing time that rendering will take, it's easier and quicker to edit a text file than modify the whole video.

## Video Transcription 

Turns out you don't need to reinvent the wheel 😅. AWS [^2] & GCP [^3] both offer speech-to-text transcription services at a decent price. 

Planning to use this at Trustworthy for video transcription, not at the moment, but will have to get to this eventually.

p.s. Transcribing is the process of writing out a copy of something, while transcription is the written version of something spoken. (somewhat the same, just different way of how AWS & GCP refer to the same thing)

[^1]: MDN Article on Adding captions and subtitles to HTML video - https://developer.mozilla.org/en-US/docs/Web/Media/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
[^2]: Video Transcription via AWS - https://aws.amazon.com/pm/transcribe
[^3]: Video Transcription via GCP - https://cloud.google.com/video-intelligence/docs/transcription

