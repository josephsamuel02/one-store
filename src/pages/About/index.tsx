import React from "react";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";

const About: React.FC = () => {
  return (
    <>
      <DefaultNav />
      <div className="w-full h-full mb-4 md:mb-36 py-5 md:py-20 px-0 md:px-20 lg:px-40 bg-bg1 bg-center bg-cover bg-no-repeat flex flex-col ">
        <div className="mt-20 px-6 md:px-20 pb-20 mx-auto w-11/12 md:w-full h-auto   bg-white rounded-sm md:rounded-xl shadow-lg">
          <img
            src="/img/OneStore logo.svg"
            alt="company logo"
            className=" my-6 mx-auto w-36 h-auto"
          />

          <h2 className=" text-xl  py-4 md:py-5 md:pt-8  font-bold text-[#e30202] text-center ">
            About Us
          </h2>

          <h2 className=" text-base md:text-2xl font-bold  text-[#e30202]  pb-4 pt-10 uppercase">
            Welcome to One Store
          </h2>
          <p className="text-base text-gray-900 leading-9">
            At Onestore, We're dedicated to providing you with quality products and exceptional
            service. With a wide selection of items across various categories, from fashion to
            electronics, We're here to meet all your needs. Shop with confidence at Onestore,
            where customer satisfaction is our top priority. Join us today and discover a
            better way to shop online.
          </p>

          <h2 className=" text-base md:text-2xl font-bold  text-[#e30202]  pb-4 pt-10 uppercase">
            OUR CORE VALUES
          </h2>
          <p className="text-base text-gray-900 leading-9">
            Integrity: We employ the highest ethical standards, demonstrating honesty and
            fairness to all concerned.
            <br /> <br />
            Customer satisfaction: We are dedicated to satisfying customer needs and honouring
            commitments.
            <br />
            Excellence: We are committed to selling and delivering high quality products and
            services, and in this way, strive to be the best in quality and in everything we
            do.
            <br />
            Respect: We honour the rights and beliefs of our staff, customers, shareholders,
            manufacturers and host community. We treat others with the highest degree of
            dignity, equality and trust.
          </p>

          <h2 className=" text-base md:text-2xl font-bold  text-[#e30202]  pb-4 pt-10 uppercase">
            Teamwork
          </h2>
          <p className="text-base text-gray-900 leading-9">
            We promote and support a diverse, yet unified team. We are committed to a teamwork
            environment where every staff is a valued member, treated with respect, encouraged
            to contribute to our growth, and recognized and rewarded for his/her efforts.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
