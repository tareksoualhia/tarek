import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminVideoCallService } from 'src/app/services/admin-video-call.service';

@Component({
  selector: 'app-admin-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-video-call.component.html',
  styleUrls: ['./admin-video-call.component.scss']
})
export class AdminVideoCallComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  peerConnection?: RTCPeerConnection;
  localStream?: MediaStream;
  signalingActive = false;

  loading = false;
  message = '';
  roomName = 'global_video_room';

  constructor(private signaling: AdminVideoCallService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.signaling.connectToRoom(this.roomName);
    this.signaling.sendSignal({
      type: 'join',
      user: 'admin',
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

          if (remoteDesc.type === 'answer') {
            await this.peerConnection!.setRemoteDescription(remoteDesc);
            this.message = 'Connexion établie.';
          } else if (remoteDesc.type === 'offer') {
            console.warn('Unexpected offer received on admin side.');
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

  async startCall() {
    if (!this.peerConnection) return;

    try {
      this.loading = true;
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.signaling.sendSignal({ sdp: offer });
      this.message = 'Appel lancé...';
    } catch (err) {
      console.error('Call start error:', err);
      this.message = 'Erreur lors du démarrage de l’appel.';
    }
  }

  get isPeerReady(): boolean {
    return !!this.peerConnection;
  }
  disconnectCall(): void {
  try {
    this.signaling.sendSignal({
      type: 'leave',
      user: 'admin',
      room: this.roomName,
      timestamp: new Date().toISOString()
    });

    this.peerConnection?.close();
    this.peerConnection = undefined;

    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = undefined;

    this.message = 'Appel terminé.';
    this.loading = false;
  } catch (err) {
    console.error('Disconnect error:', err);
    this.message = 'Erreur lors de la déconnexion.';
  }
}

}
