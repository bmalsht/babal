import { CSSTransition, TransitionGroup } from "react-transition-group";

import React from "react";

/**
 * Class representing the main application
 * @extends React.Component
 */
class App extends React.Component {
  // CONSTRUCTOR
  constructor(props) {
    super(props);

    this.state = {
      menuActive: false,
      sectionIdActive: "",
      sections: [
        {
          active: false,
          id: "about",
          label: "About",
        },
        {
          active: false,
          id: "expertise",
          label: "Expertise",
        },
        {
          active: false,
          id: "principles",
          label: "Principles",
        },
        {
          active: false,
          id: "management",
          label: "Management",
        },
        {
          active: false,
          id: "caseStudies",
          label: "Case Studies",
        },
        {
          active: false,
          id: "contact",
          label: "Contact",
        },
      ],
      scrollTop: 0,
    };

    this.handleKeypress = this.handleKeypress.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollToSection = this.handleScrollToSection.bind(this);
    this.handleToggleMenuActive = this.handleToggleMenuActive.bind(this);

    // create references namespace
    this.references = {};

    // create ref for header
    this.references.header = React.createRef();

    // create ref for each section
    this.state.sections.forEach((section) => {
      this.references[section.id] = React.createRef();
    });
  }

  // LIFECYCLE HOOKS
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeypress);
    window.removeEventListener("scroll", this.handleScroll);
  }

  // METHODS
  handleKeypress(e) {
    // if esc is pressed close the menu
    if (e.keyCode === 27) {
      this.setState({ menuActive: false });
    }
  }

  handleScroll() {
    if (window) {
      const windowHeight = window.innerHeight;
      const windowScrollTop = window.pageYOffset;
      const windowScrollBottom = windowScrollTop + windowHeight;

      // set current scrollTop
      this.setState({
        scrollTop: windowScrollTop,
      });

      // for each section calculate % of how far through viewport it is
      this.state.sections.forEach((section) => {
        if (
          this.references[section.id] &&
          this.references[section.id].current
        ) {
          const sectionHeight = this.references[
            section.id
          ].current.getBoundingClientRect().height;
          const sectionTop =
            windowScrollTop +
            this.references[section.id].current.getBoundingClientRect().top; // relative to document NOT viewport
          const sectionBottom = sectionTop + sectionHeight;

          let percentage = 0;

          if (sectionTop > windowScrollBottom) {
            // if section top is below bottom of viewport
            percentage = 0;
          } else if (sectionBottom < windowScrollTop) {
            // if section bottom is above top of viewport
            percentage = 100;
          } else {
            // section is in viewport
            const distance = windowScrollBottom - sectionTop;

            percentage = (distance / sectionHeight) * 100;
          }

          // if section top is 25% or more in viewport set nav item to active (show arrow)
          if (windowScrollTop < 200) {
            this.setSectionActive("about");
          } else if (percentage > 25 && percentage < 100) {
            this.setSectionActive(section.id);

            // add class to section div - never remove
            this.references[section.id].current.classList.add(
              "scroll-fade--active"
            );
          }
        }
      });
    }
  }

  handleScrollToSection(e, sectionId) {
    e.preventDefault();

    // clear focus style when clicked
    e.currentTarget.blur();

    if (
      window &&
      this.references.header &&
      this.references.header.current &&
      this.references[sectionId] &&
      this.references[sectionId].current
    ) {
      const bodyTop = document.body.getBoundingClientRect().top;
      const sectionTop = this.references[
        sectionId
      ].current.getBoundingClientRect().top;
      const sectionPosition = sectionTop - bodyTop;

      const headerHeight = this.references.header.current.getBoundingClientRect()
        .height;
      const offset = window.outerWidth < 992 ? headerHeight : 0;

      // scroll section in to viewport
      window.scrollTo({
        behavior: "smooth",
        top: sectionPosition - offset,
      });

      // if on small screen close full width menu after click
      if (window.outerWidth < 760) {
        this.setState({ menuActive: false });
      }
    }
  }

  handleToggleMenuActive() {
    this.setState((prevState) => {
      return {
        menuActive: !prevState.menuActive,
      };
    });
  }

  setSectionActive(sectionId) {
    this.setState((prevState) => {
      const sections = prevState.sections.map((section) => {
        if (section.id === sectionId) {
          section.active = true;
        } else {
          section.active = false;
        }

        return section;
      });

      return {
        sectionIdActive: sectionId,
        sections,
      };
    });
  }

  // RENDER
  render() {
    return (
      <>
        <header className="bg-athensgray header">
          <div ref={this.references.header}>
            <div className="container pb0">
              <div className="col col-1 sm-col-2 md-col-5">
                <h1 className="h1 scroll-fade scroll-fade--active scroll-fade--delay-1">
                  Prescient
                  <br />
                  Group
                </h1>
                <nav className="fixed hide md-show navigation scroll-fade scroll-fade--active scroll-fade--delay-2">
                  <ul className="ul ul--spread">
                    {this.state.sections.length > 0 &&
                      this.state.sections.map((section) => {
                        return (
                          <li key={section.id}>
                            <a
                              className={`a h4${
                                section.active ? " a--active" : ""
                              }`}
                              href={`#${section.id}`}
                              onClick={(e) =>
                                this.handleScrollToSection(e, section.id)
                              }
                            >
                              <i className="icon-arrow red" />
                              <span>{section.label}</span>
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* about section */}
        <section className="bg-athensgray section">
          <div
            className="scroll-fade scroll-fade--active scroll-fade--delay-3"
            id="about"
            ref={this.references.about}
          >
            <div className="container">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-2 md-col-4">
                <h2 className="h2 hide-accessible-md">About</h2>
              </div>
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h3 className="h3">
                  We are a management consultancy known for shaping and
                  operating renowned food &amp; beverage, retail and cultural
                  destinations.
                </h3>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <p className="p">
                  Prescient Group works with operators, investors and developers
                  on business strategy and its implementation to transform
                  spaces into meaningful assets that deliver targeted results.
                </p>
                <p className="p">
                  We are visionary in the way we create, deliver and operate.
                  Our focus is to ensure results are aligned with stakeholder
                  approved operating and financial strategies.
                </p>
                <p className="p">
                  Projects range from feasibility assessments to programmes with
                  complex workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* expertise section */}
        <section className="bg-seashellpeach section">
          <div
            className="scroll-fade scroll-fade--active scroll-fade--delay-4"
            id="expertise"
            ref={this.references.expertise}
          >
            <div className="container">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-2 md-col-4">
                <h2 className="h2 hide-accessible-md">Expertise</h2>
              </div>
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Placemaking</h4>
                <p className="p">
                  We unlock brand identity, incorporating various
                  differentiators unique to the location and often applicable to
                  urban regeneration.
                </p>
                <p className="p">
                  Our networks discover and connect operators to develop an
                  exciting category and tenant mix that enhances the strategic
                  profile of a destination with meanwhile uses through to longer
                  term development.
                </p>
                <p className="p">
                  Our team creates and manages marketing strategy to promote
                  cultural relevance to drive exposure and brand equity leading
                  to sustained footfall.
                </p>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Food &amp; Beverage and Retail</h4>
                <p className="p">
                  Our expertise is applicable from high profile restaurants to
                  fast casual dining. We also support projects incorporating a
                  significant retail environment.
                </p>
                <p className="p">
                  We initially support concept development regarding visioning
                  with graphic and interior designers, then coordinate
                  operational work flows and infrastructure requirements with
                  architects and building specialists leading to developed and
                  technical designs. Thereafter, we structure operations, lead
                  recruiting and build a strong administration, front and back
                  of house.{" "}
                </p>
                <p className="p">
                  Our team can also operate under a limited management agreement
                  from pre-opening operations through to exit.{" "}
                </p>
              </div>
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Events</h4>
                <p className="p">
                  We curate experiential events that support brand values, build
                  reputation and promote community engagement. This creates
                  vibrant and animated spaces that delivers material content for
                  the marketing team.
                </p>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Corporate Strategy &amp; Finance</h4>
                <p className="p">
                  It is paramount that financial strategy meets operational
                  objectives. We apply comprehensive and hands-on approach to
                  developing the right funding strategy for launch, expanding
                  operations and preparing for an exit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* principles section */}
        <section className="bg-athensgray section">
          <div
            className="scroll-fade"
            id="principles"
            ref={this.references.principles}
          >
            <div className="container pb0">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col md-col-4">
                <h2 className="h2 hide-accessible-md">Principles</h2>
              </div>
              <div className="col col-1 sm-col2 md-col-5">
                <div className="container">
                  <div className="col col-hide md-col-1 md-col-show" />
                  <div className="col col-1 sm-col-1 md-col-2">
                    <hr className="hr" />
                    <h3 className="h3">
                      We structure effective trading principles for operators
                      and unlock real estate potential for developers.
                    </h3>
                    <hr className="hr hr--shorter-gap" />
                    <p className="p">
                      Trusted team members with proven skills support the
                      delivery of key commercial areas, from inception to
                      re-positioning and preparation for exit.
                    </p>
                    <p className="p">
                      Past projects reflect our principles and how we conduct
                      business:
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Team Dynamic</h4>
                <p className="p">
                  The teams we build, lead and manage, care about making a
                  material difference by delivering well researched and
                  articulated outcomes that respect an attractive return on
                  investment.
                </p>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Leadership</h4>
                <p className="p">
                  We provide leadership in guiding our clients and teams through
                  a methodology with clear direction and accountability that is
                  consistently kept in alignment with stakeholder strategy and
                  our mandate.
                </p>
              </div>
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Client Support</h4>
                <p className="p">
                  We support our clients to clear obstacles and create the
                  necessary runway so projected timelines remain achievable.
                </p>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Digital Identity</h4>
                <p className="p">
                  We have found it is essential to build a unique digital
                  identity and a compelling narrative that is promoted
                  effectively, and when requested, deliver a best in class
                  turn-key solution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* management section */}
        <section className="bg-seashellpeach section">
          <div
            className="scroll-fade"
            id="management"
            ref={this.references.management}
          >
            <div className="container pb0">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-2 md-col-4">
                <h2 className="h2 hide-accessible-md">Management</h2>
              </div>
              <div className="col col-1 sm-col-2 md-col-5">
                <div className="container pb0">
                  <div className="col col-hide md-col-1 md-col-show" />
                  <div className="col col-1 sm-col-1 md-col-2">
                    <hr className="hr" />
                    <h3 className="h3">
                      Our organisation is led by directors with respected
                      accomplishment and developed networks.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <img
                  alt="Stephen Macintosh"
                  className="mt40 sm-mt60 md-mt80"
                  src="/images/stephen@1x.jpg"
                  srcSet="/images/stephen@1x.jpg 1x,
                                        /images/stephen@2x.jpg 2x"
                />
                <hr className="hr hr--short-gap" />
                <h4 className="h4 h4--lh">
                  Stephen Macintosh
                  <br />
                  Director
                </h4>
                <p className="p">
                  Stephen has worked as a serial operator under Chris Corbin and
                  Jeremy King running their restaurants for over a decade. He
                  has also established and lead restaurants for Heston
                  Blumenthal and Daniel Boulud working with Mandarin Oriental.
                </p>
                <p className="p">
                  Thereafter Stephen developed a boutique advisory business
                  providing strategic services for many high-profile clients
                  including Ralph Lauren and Value Retail.
                </p>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <img
                  alt="Farhaan Mir"
                  className="mt40 sm-mt60 md-mt80"
                  src="/images/farhaan@1x.jpg"
                  srcSet="/images/farhaan@1x.jpg 1x,
                                        /images/farhaan@2x.jpg 2x"
                />
                <hr className="hr hr--short-gap" />
                <h4 className="h4 h4--lh">
                  Farhaan Mir
                  <br />
                  Director
                </h4>
                <p className="p">
                  Farhaan has developed strategic planning, marketing and
                  corporate finance expertise, founding and exiting several
                  businesses over the past 25 years. Most recently he co-founded
                  a management company that created and managed concept,
                  operations and marketing for Old Spitalfields Market.
                </p>
                <p className="p">
                  Previously Farhaan was a founding shareholder providing
                  leadership for the strategy, development and financing of the
                  Petersham Nurseries multi-unit complex in Covent Garden.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* case-studies section */}
        <section className="bg-athensgray section">
          <div
            className="scroll-fade"
            id="caseStudies"
            ref={this.references.caseStudies}
          >
            <div className="container pb0">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-2 md-col-4">
                <h2 className="h2 hide-accessible-md">Case Studies</h2>
              </div>
            </div>
            <div className="container">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">
                  Petersham Nurseries at Covent Garden
                </h4>
                <p className="p">
                  In 2015 Petersham Nurseries wanted to expand to central
                  London. We were responsible to the founding family to lead the
                  corporate and financialstrategy along with start-up operations
                  for the Covent Garden complex comprising of 2 restaurants,
                  retail store and deli around its central Floral Court
                  courtyard.
                </p>

                <p className="p">
                  We lead a large team of over 100 employees in preparation of
                  the concept, brand identity and operating structure that
                  secured the 15,000 sq ft location. We negotiated lease terms,
                  prepared the business plan and managed corporate finance. This
                  included establishing a corporate structure, licensing/
                  trademark strategy, financing, construction and resourcing.
                </p>
                <p className="p">
                  We supervised a complicated and shifting design and
                  construction fit-out program within a Grade II listed
                  building, coordinating with the landlord and their
                  construction team that was refurbishing the base-build core &
                  shell.
                </p>

                <p className="p">
                  Thereafter we secured the premises license, lead the hiring of
                  key management, department heads and operative personnel, then
                  managed finance and operations through to a very successful
                  launch in 2017.
                </p>
              </div>
              <div className="col col-1 sm-col-1 md-col-2">
                <hr className="hr" />
                <h4 className="h4 h4--lh">Old Spitalfields Market</h4>
                <p className="p">
                  When the owner of Old Spitalfields Market was ready to
                  refurbish the market, we presented an architectural scheme for
                  our vision of a central shared multi-unit kitchen surrounded
                  by movable retail stalls within the historic Victorian
                  perimeter, as part of a placemaking strategy that included
                  events.
                </p>
                <p className="p">
                  We worked with Foster + Partners and renowned Chef Nuno Mendes
                  on the development of the technical designs for the kitchen
                  and retail units. Preferred specialists from our network
                  managed construction budgets/program, MEP and equipment
                  installation.
                </p>
                <p className="p">
                  We also crafted the sales and marketing strategy which was
                  implemented by our team that creating the website and
                  marketing collateral, culminating with the leading ranking for
                  all London markets.
                </p>
                <p className="p">
                  We sourced strategic operators and secured high profile events
                  such as the first physical Instagram market that shaped the
                  identity of the market,which was recognized as the CBRE top 10
                  European Foodhall and the only UK entrant.
                </p>
                <p className="p">
                  The success of the market led to high occupancy and
                  construction of additional leasable space in the historic
                  perimeter attracting valuable highcovenant strength tenants.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-midnight footer">
          <div id="contact" ref={this.references.contact}>
            <div className="container container--short">
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-2 md-col-4">
                <h2 className="h2 hide-accessible">Contact</h2>
              </div>
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-1">
                <hr className="hr hr--short-gap" />
                <address className="address">
                  <ul className="ul">
                    <li>
                      <span className="white">Stephen Macintosh</span>
                    </li>
                    <li>
                      <a className="a white" href="tel:+4407795176211">
                        +44 (0)779 517 6211
                      </a>
                    </li>
                    <li>
                      <a
                        className="a white"
                        href="mailto:stephen@prescientgroup.uk"
                      >
                        stephen@prescientgroup.uk
                      </a>
                    </li>
                  </ul>
                </address>
              </div>
              <div className="col col-hide md-col-1 md-col-show" />
              <div className="col col-1 sm-col-1 md-col-1">
                <hr className="hr hr--short-gap" />
                <address className="address">
                  <ul className="ul">
                    <li>
                      <span className="white">Farhaan Mir</span>
                    </li>
                    <li>
                      <a className="a white" href="tel:+4407543002000">
                        +44 (0)754 300 2000
                      </a>
                    </li>
                    <li>
                      <a
                        className="a white"
                        href="mailto:farhaan@prescientgroup.uk"
                      >
                        farhaan@prescientgroup.uk
                      </a>
                    </li>
                  </ul>
                </address>
              </div>
            </div>
          </div>
        </footer>

        <button
          className={`fixed bg-transparent border-0 btn burger${
            this.state.menuActive ? " burger--active" : ""
          }`}
          onClick={this.handleToggleMenuActive}
          type="button"
        >
          <div
            className={`icon-burger${
              this.state.menuActive ? " white" : " midnight"
            }`}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </button>

        <TransitionGroup>
          {this.state.menuActive && (
            <CSSTransition classNames="slide" key="myCoolKey" timeout={150}>
              <aside className="aside bg-midnight">
                <div className="h1 h1--mb white sm-hide">
                  Prescient
                  <br />
                  Group
                </div>
                <nav>
                  <ul className="ul ul--spread">
                    {this.state.sections.length > 0 &&
                      this.state.sections.map((section) => {
                        return (
                          <li key={section.id}>
                            <a
                              className={`a h4${
                                section.active ? " a--active" : ""
                              } white`}
                              href={`#${section.id}`}
                              onClick={(e) =>
                                this.handleScrollToSection(e, section.id)
                              }
                            >
                              <span>{section.label}</span>
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </nav>
                <hr className="hr" />
                <address className="address">
                  <ul className="ul">
                    <li>
                      <span className="white">Stephen Macintosh</span>
                    </li>
                    <li>
                      <a className="a white" href="tel:+4407795176211">
                        +44 (0)779 517 6211
                      </a>
                    </li>
                    <li>
                      <a
                        className="a white"
                        href="mailto:stephen@prescientgroup.uk"
                      >
                        stephen@prescientgroup.uk
                      </a>
                    </li>
                  </ul>
                </address>
                <hr className="hr" />
                <address className="address">
                  <ul className="ul">
                    <li>
                      <span className="white">Farhaan Mir</span>
                    </li>
                    <li>
                      <a className="a white" href="tel:+4407543002000">
                        +44 (0)754 300 2000
                      </a>
                    </li>
                    <li>
                      <a
                        className="a white"
                        href="mailto:farhaan@prescientgroup.uk"
                      >
                        farhaan@prescientgroup.uk
                      </a>
                    </li>
                  </ul>
                </address>
              </aside>
            </CSSTransition>
          )}
        </TransitionGroup>
      </>
    );
  }
}

module.exports = App;
