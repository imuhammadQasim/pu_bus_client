import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border px-4 md:px-7 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground z-[100]">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mb-2 md:mb-0">
        <span>© {new Date().getFullYear()} University of the Punjab</span>
        <a
          href="https://pu.edu.pk/"
          className="hover:text-primary font-medium transition-colors"
        >
          Help Center
        </a>
        <a
          href="#"
          className="hover:text-primary font-medium transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="hover:text-primary font-medium transition-colors"
        >
          Terms of Service
        </a>
      </div>
      <div className="flex items-center gap-2 font-medium">
        <span>Developed by </span>
        <strong className="text-primary font-bold">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/923240682963?text=Hello%20Muhammad"
          >
            Muhammad
          </a>
        </strong>
      </div>
    </footer>
  );
};

export default Footer;
