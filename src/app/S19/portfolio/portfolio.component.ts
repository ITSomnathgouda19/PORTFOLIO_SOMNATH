import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, Renderer2, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // 👈 YEH IMPORT KARNA ZAROORI HAI
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

interface Certificate {
  title: string;
  tagline: string;
  image: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],  // 👈 FormsModule YAHAN ADD KARO
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {

  private wheelUnlisten: (() => void) | null = null;
  private index = 0;
  private locked = false;
  private totalSlides = 0;
  experienceIndex = 0;
  private totalExperiences = 2;

// home section content my name and intro
roles: string[] = [
    'Web Developer',
    'Python Developer',
    'UI/UX Designer'
  ];

  currentRole: number = 0;
  private intervalId: any;

  ngOnInit(): void {
      this.startRoleRotation();
  }

  startRoleRotation(): void {
    this.intervalId = setInterval(() => {
      this.currentRole = (this.currentRole + 1) % this.roles.length;
    }, 2000);
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }


    if (this.wheelUnlisten) {
      this.wheelUnlisten();
      this.wheelUnlisten = null;
    }

    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    
  }


  // ================= EMAIL RELATED =================
  formData: any = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  isSuccess = false;
  isError = false;
  errorMessage = '';

  
  private serviceID = environment.emailServiceID;
  private templateID = environment.emailTemplateID;
  private publicKey = environment.emailPublicKey;

  selectedIndex = 0;
  autoSlideInterval: any;

  // ================= EDUCATION =================
  activeIndex = 0;

  educations = [
    {
      label: '10th',
      title: 'Secondary School (10th)',
      institute: 'Shree Devki Nandan School',
      medium: 'Hindi',
      duration: '2018 – 2019',
      image: '../../assets/browng-profile.png',
      result: 'QUALIFIED FOR SECONDARY SCHOOL CERTIFICATE',
      percentage: 46,
      grade: 'C2',
      description:
        'Built strong academic fundamentals in Mathematics, Science and logical reasoning.',
      location: {
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395006',
      },
    },
    {
      label: '12th',
      title: 'Higher Secondary (12th)',
      institute: 'Shree Gurukrupaa Vidhya Sankul',
      board: 'GSEB',
      medium: 'Hindi',
      duration: '2020 – 2021',
      image: '../../assets/silver-profile.png',
      result: 'ELIGIBLE FOR QUALIFYING CERTIFICATE',
      percentage: 55,
      grade: 'C1',
      description:
        'Specialized in ENGLISH, ECONOMICS and STATISTICS with strong analytical focus.',
      location: {
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395006',
      },
    },
    {
      label: 'UG',
      title: 'Bachelor of Computer Applications',
      institute: 'SMT Z.S.Patel College',
      university: 'VNSGU',
      course: 'Computer Applications',
      duration: '2021 – 2024',
      image: '../../assets/golden-profile.png',
      sgpa: [6.61, 7.09, 7.04, 6.52, 6.35, 8.13],
      cgpa: 6.95,
      grade: 'B',
      description:
        'Learned programming, DBMS, operating systems and web development fundamentals.',
      location: {
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395007',
      },
    },
    {
      label: 'PG',
      title: 'M.Sc. in Information & Communication Technology',
      institute:
        'J. P. DAWER INSTITUTE OF. INFORMATION SCIENCE & TECHNOLOGY',
      university: 'VNSGU',
      course: 'ICT',
      duration: '2024 – present',
      image: '../../assets/diamond-profile.png',
      sgpa: [0.0, 0.0, 0.0, 0.0],
      cgpa: 0.0,
      grade: '-',
      description:
        'Advanced expertise in full-stack development, system design and scalable applications.',
      location: {
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395007',
      },
    },
  ];

  constructor(private renderer: Renderer2) {
    // EmailJS initialize with public key
    emailjs.init(this.publicKey);
  }


  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    const slider = document.getElementById('slider') as HTMLElement | null;
    const dots = Array.from(document.querySelectorAll('.dot')) as HTMLElement[];
    const sliderView = slider ? (slider.parentElement as HTMLElement) : null;

    if (!slider || !sliderView) return;

    this.totalSlides = Math.max(slider.children.length, dots.length, 1);

    const update = () => {
      this.index = Math.max(0, Math.min(this.index, this.totalSlides - 1));
      slider.style.transform = `translateX(-${this.index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === this.index));
    };

    const handler = (e: WheelEvent) => {
      e.preventDefault();

      if (this.locked) return;
      this.locked = true;

      if (e.deltaY > 0 && this.index < this.totalSlides - 1) this.index++;
      if (e.deltaY < 0 && this.index > 0) this.index--;

      update();
      setTimeout(() => (this.locked = false), 700);
    };

    this.wheelUnlisten = this.renderer.listen(sliderView, 'wheel', handler);
    update();
  }

  // ================= EXPERIENCE =================
  nextExperience(): void {
    this.experienceIndex =
      (this.experienceIndex + 1) % this.totalExperiences;
  }

  // ================= EDUCATION =================
  get activeEdu() {
    return this.educations[this.activeIndex];
  }

  get progressWidth(): number {
    return (
      (this.activeIndex / (this.educations.length - 1)) * 100
    );
  }

  setStep(index: number) {
    this.activeIndex = index;
  }

  // ================= CERTIFICATES =================
  selectCertificate(index: number) {
    this.selectedIndex = index;
  }

  // ================= EMAIL =================
  async sendEmail() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.showError('Please fill all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.showError('Please enter a valid email');
      return;
    }

    this.isSubmitting = true;
    this.isError = false;

    const templateParams = {
      name: this.formData.name,
      email: this.formData.email,
      message: this.formData.message,
      to_email: 'itsomnathgouda19@gmail.com'
    };

    try {
      await emailjs.send(
        this.serviceID,
        this.templateID,
        templateParams
      );
      
      this.isSuccess = true;
      this.isSubmitting = false;
      this.formData = { name: '', email: '', message: '' };
      
      setTimeout(() => {
        this.isSuccess = false;
      }, 5000);
      
    } catch (error) {
      this.showError('Failed to send message. Please try again.');
    }
  }

  private showError(message: string) {
    this.isError = true;
    this.errorMessage = message;
    this.isSubmitting = false;
    
    setTimeout(() => {
      this.isError = false;
    }, 5000);
  }



  viewcertificates: Certificate[] = [
    { title: '10th Graduation Certificate', tagline: 'Secondary School Education completion.', image: 'assets/10th-certificate.jpg' },
    { title: '12th Graduation Certificate', tagline: 'Higher Secondary Education completion.', image: 'assets/12th-certificate.jpg' },
    { title: '(UG) Under Graduation Certificate', tagline: 'Bachelor\'s Degree in BCA.', image: 'assets/UG-certificate.jpeg' },
    { title: 'Brand Visionary Internship', tagline: '3-month UI/UX Design and Digital Marketing internship.', image: 'assets/BV-certificate.jpg' },
    { title: 'ADCA Computer Certificate', tagline: 'Advance Diploma in Computer Applications.', image: 'assets/ADCA-certificate.jpg' },
    { title: 'School Running Certificate', tagline: 'Academic participation and achievement Green INDIA.', image: 'assets/School-certificate.jpg' },
    { title: 'SGM Certificate', tagline: 'Specialized skill certification.', image: 'assets/SGM-certificate.jpg' },
    { title: '(PG) POst Graduation Certificate', tagline: '.', image: 'assets/empty-img.png' }
  ];

  // Set the first certificate as the default selection
  showcertificates: Certificate = this.viewcertificates[0];

  showCertificates(cert: Certificate) {
    this.showcertificates = cert;
  }


  // resume viewer
  isResumeOpen = false;

  openResume() {
    this.isResumeOpen = true;
  }

  closeResume() {
    this.isResumeOpen = false;
  }
}