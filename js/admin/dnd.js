48cd08a2f176e3c09e2f0
Description-en: Trivial sqlite3 binding for Go (development files)
 Sqlite / Sqlite 3 binding for Go.
 Access to sqlite and sqlite3 databases.
 .
 This package contains the source.

Package: golang-goyaml-dev
Description-md5: 086e0da0f7b47a4b4e1addd0d76cdb5d
Description-en: YAML support for the Go language
 The goyaml package enables Go programs to very comfortably encode and
 decode YAML values. It was developed within Canonical as part of the
 juju project, and is based on a pure Go port of the well-known libyaml
 C library to parse and generate YAML data quickly and reliably.
 .
 goyaml is almost compatible with YAML 1.1, including support for
 anchors, tags, etc. There are still a few missing bits, such as
 document merging, base-60 floats, and multi-document unmarshalling.

Package: golang-guestfs-dev
Description-md5: 81d5f68a5cacd378d31ecfde67a47153
Description-en: guest disk image management system - Golang bindings
 The libguestfs library allows accessing and modifying guest disk
 images.
 .
 This package contains source for the Golang bindings.

Package: golang-libgeoip-dev
Description-md5: 65ba3905eae4e8ce6a157b2cbf3e5fad
Description-en: Go implementation for lookups against GeoIP files
 This is the Go implementation of the Maxmind GeoIP API. It is incomplete and
 work in progress the initial goal is support only two of the database types –
 the City Lite and Country Lite. The only supported method is loading the full
 db on startup into memory (memory cache).
 .
 At this point, only IPv4 lookups are supported.

Package: golang-log4go-dev
Description-md5: fc1009f5be6fd97a2e515fc6b45c3a5c
Description-en: Go package for level-based and highly configurable logging
 The goal of log4go is to be a robust, configurable, powerful logging
 package to empower Go developers to debug their programs more
 effectively on the fly and diagnose problems in the field without
 hampering their effectiveness during development or hampering the
 performance of their applications.
 .
 This package is a replacement logging package which will be boqth a
 drop-in replacement for and a significant extension of the built-in
 logging functionality in Go.
 .
 It features:
  + File logging with rotation and custom output formats
  + Console logging
  + Network logging via JSON and TCP/UDP
  + XML Logger
  + Automatic log filtering based on log levels on a per-output basis
  + XML configuration available for no-compile changes to logging
  + Wrapper functions and global loggers for easy configuration and
    rapid deployment

Package: golang-metrics-dev
Description-md5: 1a75a044b402426a7ebfc737fce1d1d1
Description-en: Go package to capture application-level metrics
 This package is a Go port of Coda Hale's Metrics library for Java. It
 allows one to easily collect metrics from an application written in
 Go in an unobtrusive way. Metrics can then be exported to syslog,
 files or to a storage system like Graphite.

Package: golang-mode
Description-md5: 1857af03b0b11392c79e41670dd43e5f
Description-en: Go programming language - mode for GNU Emacs
 This package provides a GNU Emacs major mode for editing code in
 Google's Go programming language.

Package: golang-mux-dev
Description-md5: e8b7a6d8ad775de125d0f7589be4aca6
Description-en: URL router and dispatcher
 gorilla/mux implements a request router and dispatcher.
 .
 The name mux stands for "HTTP request multiplexer". Like the standard
 http.ServeMux, mux.Router matches incoming requests against a list of
 registered routes and calls a handler for the route that matches the URL
 or other conditions. The main features are:
 .
  * Requests can be matched based on URL host, path, path prefix, schemes,
    header and query values, HTTP methods or using custom matchers.
  * URL hosts and paths can have variables with an optional regular
    expression.
  * Registered URLs can be built, or "reversed", which helps maintaining
    references to resources.
  * Routes can be used as subrouters: nested routes are only tested if the
    parent route matches. This is useful to define groups of routes that
    share common conditions like a host, a path prefix or other repeated
    attributes. As a bonus, this optimizes request matching.
  * It implements the http.Handler interface so it is compatible with the
    standard http.ServeMux.

Package: golang-nuntium-mms-dev
Description-md5: 00636adae97bcbbf956f892fa88b2e0c
Description-en: Go library for manipulating MMS
 This package handles MMS PDUs and has hooks for related actions in the MMS
 workflow

Package: golang-nuntium-ofono-dev
Description-md5: d694438b866c99aa3a273db282e89e0e
Description-en: Go library for interfacing with ofono
 Provides facilities to interface with ofono with regards to MMS through dbus

Package: golang-nuntium-telepathy-dev
Description-md5: a3981f59ddae5bd772f1670bc6a28169
Description-en: Go library for interfacing with telepathy-ofono
 Provides facilities to interface with telepathy ofono with regards to MMS
 through dbus

Package: golang-nzaat-dev
Description-md5: 066d144f731bef0df882353c976035cf
Description-en: Go implementation of the NZAAT hash algorithm
 Go implementation of the hash algorithm "NUL zaehlen an allen Teilen"
 based on the One At A Time hash (OAAT) by Bob Jenkins. This is not a
 cryptographic hash, but it satisfies the perfect hash criteria well
 enough to be usable as a hash table hash or similar.

Package: golang-objx-dev
Description-md5: 9a5d3e1a35b72fb54f38d804780b2d19
Description-en: Go package for dealing with maps, slices, JSON and other data.
 Objx provides the `objx.Map` type, which is a `map[string]interface{}` that
 exposes a powerful `Get` method (among others) that allows you to
 easily and quickly get access to data within the map, without having to
 worry too much about type asser