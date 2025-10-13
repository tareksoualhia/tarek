import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientVideoCallService } from 'src/app/services/client-video-call.service';

@Component({
  selector: 'app-client-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-video-call.component.html',
  styleUrls: ['./client-video-call.component.scss']
})
export class ClientVideoCallComponent implements AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo?: ElementRef<HTMLVideoElement>;

  peerConnection?: RTCPeerConnection;
  localStream?: MediaStream;
  signalingActive = false;

  message = '';
  roomName = 'global_video_room';

  constructor(private signaling: ClientVideoCallService) {}

  ngAfterViewInit(): void {
    this.signaling.connectToRoom(this.roomName);
    this.signaling.sendSignal({
      type: 'join',
      user: 'client',
      room: this.roomName,
      timestamp: new Date().toISOString()
    });

    this.initCall();
  }

  ngOnDestroy(): void {
    this.signaling.closeConnection();
    this.peerConnection?.close();
    this.localStream?.getTracks().forEach(track => track.stop());
  }

  async initCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (this.localVideo?.nativeElement) {
        this.localVideo.nativeElement.srcObject = this.localStream;
        this.localVideo.nativeElement.play().catch(err => {
          console.warn('Autoplay failed:', err);
        });
      }

      this.peerConnection = new RTCPeerConnection();

      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });

      this.peerConnection.ontrack = event => {
        if (this.remoteVideo?.nativeElement && event.streams[0]) {
          this.remoteVideo.nativeElement.srcObject = event.streams[0];
        }
      };

      this.peerConnection.onicecandidate = event => {
        if (event.candidate) {
          this.signaling.sendSignal({ candidate: event.candidate });
        }
      };

      this.setupSignaling();
    } catch (err: any) {
      console.error('Media access error:', err);
      this.message = err.name === 'NotFoundError'
        ? 'Aucun périphérique vidéo/audio détecté.'
        : 'Erreur lors de l’accès à la caméra ou au micro.';
    }
  }

  setupSignaling() {
    if (this.signalingActive || !this.peerConnection) return;
    this.signalingActive = true;

    this.signaling.onSignal(async (data: any) => {
      try {
        if (data.sdp) {
          const remoteDesc = new RTCSessionDescription(data.sdp);

          if (remoteDesc.type === 'offer') {
            await this.peerConnection!.setRemoteDescription(remoteDesc);
            const answer = await this.peerConnection!.createAnswer();
            await this.peerConnection!.setLocalDescription(answer);
            this.signaling.sendSignal({ sdp: answer });
            this.message = 'Réponse envoyée.';
          } else if (remoteDesc.type === 'answer') {
            await this.peerConnection!.setRemoteDescription(remoteDesc);
            this.message = 'Connexion établie.';
          }
        } else if (data.candidate) {
          await this.peerConnection!.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error('Signaling error:', err);
        this.message = 'Erreur de signalement.';
      }
    });
  }

  get isPeerReady(): boolean {
    return !!this.peerConnection;
  }
}
