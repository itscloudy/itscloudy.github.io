function UIControllerBase() {
    this.ui = []
}
function BaseView(a) {
    var b = this;
    b.contexts = [],
    x$(a).each(function() {
        b.contexts.push(this)
    }),
    this.observers = []
}
function GEHelpers(a) {
    this.ge = a
}
function DrivingSimulator() {
    this.directions = null,
    this.display = null,
    this.map = null,
    this.helpers = null,
    this.steps = [],
    this.path = [],
    this.dsTimer = null,
    this.mapMarker = null,
    this.running = !1,
    this.previous_state = null
}
function DrivingSimulatorTimer(a, b, c) {
    this.path = b,
    this.map = a,
    this.options = c || {},
    this.options.speed = Emulator.getValue(GM_CONFIG.ModelKeys.Time.TimeMultiplier),
    this.currentLoc = this.path[0].loc,
    this.geHelpers_ = new GEHelpers(a),
    this.doTick_ = !1,
    this.pathIndex_ = 0,
    this.currentStep_ = -1,
    this.segmentTime_ = 0,
    this.segmentDistance_ = 0
}
function Model() {
    this.lawnchair = new Lawnchair({
        adaptor: "dom"
    }),
    this.channels = {}
}
function UIControllerGroup() {
    this.controllers = []
}
function VehicleConfigurationSettingController() {
    this.controller = new BaseController("#Vehicle_Config"),
    Emulator.addController(this.controller, "VehicleConfigSettings"),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize), "onChange", Util.storeCookie, {
        key: GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize
    }),
    Emulator.storage.get(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize, 
    function(a) {
        val = a ? a.value: null,
        screenSize = val ? val: 8,
        Emulator.setValue(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize, screenSize)
    }),
    this.view = new VehicleConfigurationSettingView;
    for (var a in GM_CONFIG.VehicleConfiguration) Emulator.setValue(a, GM_CONFIG.VehicleConfiguration[a]);
    Emulator.setValue(GM_CONFIG.ModelKeys.Sync.Periodicity, GM_CONFIG.SyncPeriods.MANUALLY)
}
function VehicleDataSettingController() {
    this.controller = new BaseController("#Vehicle_Data"),
    Emulator.addController(this.controller, "VehicleDataSettings"),
    Emulator.setValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry, GM_CONFIG.VehicleData.Default_Table_List),
    this.view = new VehicleDataSettingView,
    this.view.onAddTableClick.subscribe(Util.bind(this, this.addDTCTable)),
    this.view.onRemoveTableClick.subscribe(Util.bind(this, this.removeDTCTable)),
    this.view.onSaveTableClick.subscribe(Util.bind(this, this.saveDTCTable)),
    this.view.onSelectChange.subscribe(Util.bind(this, 
    function(a, b) {
        Emulator.setValue(b.model, a)
    })),
    this.view.onSliderChange.subscribe(Util.bind(this, 
    function(a, b) {
        a < b.from || a > b.to ? b.model && this.view.setSliderValue(b.sliderid, Emulator.getValue(b.model)) : Emulator.setValue(b.model, a)
    })),
    this.view.onTimeChange.subscribe(function(a) {
        var b = new Date;
        b.setHours(a.hours, a.minutes, a.seconds),
        b.setFullYear(a.year, parseInt(a.month, 16) - 1, a.day),
        Emulator.Vehicle.TimeOffset = b.getTime() - (new Date).getTime(),
        Emulator.setValue(GM_CONFIG.ModelKeys.Time.DoIncrement, !0)
    }),
    this.view.onTimeEdit.subscribe(function() {
        Emulator.setValue(GM_CONFIG.ModelKeys.Time.DoIncrement, !1)
    });
    for (var a in GM_CONFIG.VehicleData) for (var b in GM_CONFIG.VehicleData[a]) {
        var c = GM_CONFIG.VehicleData[a][b];
        c.model && c.model.defaultValue !== undefined && Emulator.setValue(c.model.key, c.model.defaultValue)
    }
    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.OdometerOffset, GM_CONFIG.VehicleData.Vehicle_Odo_LS.odometer.model.defaultValue),
    Emulator.setValue(GM_CONFIG.ModelKeys.GPS.Timestamp, new Date),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.CurrentPosition), "onChange", 
    function(a) {
        var b = a.value;
        Emulator.setValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_lat.model.key, Emulator.secToArcMs(b.coords.latitude)),
        Emulator.setValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_long.model.key, Emulator.secToArcMs(b.coords.longitude)),
        Emulator.setValue(GM_CONFIG.VehicleData.GPS_Elevation_and_Heading_LS.gps_heading.model.key, b.coords.heading),
        Emulator.setValue(GM_CONFIG.VehicleData.GPS_Elevation_and_Heading_LS.gps_elevation.model.key, b.coords.altitude),
        Emulator.setValue(GM_CONFIG.ModelKeys.GPS.Timestamp, b.timestamp)
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_lat.model.key), "onChange", 
    function(a) {
        Emulator.setValue(GM_CONFIG.ModelKeys.GPS.Timestamp, new Date)
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry), "onChange", Util.bind(this, this.onDTCDeviceChange)),
    this.watchHandles = {},
    this.watchHandleCount = 0
}
function RadioSettingController() {
    this.controller = new BaseController("#Radio"),
    Emulator.addController(this.controller, "RadioSettings"),
    this.view = new RadioSettingView,
    Emulator.setValue(GM_CONFIG.ModelKeys.Radio.StationBand, "FM"),
    Emulator.setValue(GM_CONFIG.ModelKeys.Radio.StationChannel, "101.1"),
    Emulator.setValue(GM_CONFIG.ModelKeys.Radio.StationTitle, "The Bear"),
    Emulator.setValue(GM_CONFIG.ModelKeys.Radio.SongTitle, "Everlong"),
    Emulator.setValue(GM_CONFIG.ModelKeys.Radio.SongArtist, "The Foo Fighters"),
    Emulator.setValue(GM_CONFIG.ModelKeys.Radio.SongRDS, "???"),
    this.view.onRadioPropertyChange.subscribe(function(a, b) {
        Emulator.setValue(GM_CONFIG.ModelKeys.Radio.prefix + a, b)
    }),
    this.view.onRadioChange.subscribe(function() {
        var a = {};
        gm.communication.getRadioInfo(function(b) {
            a = b
        }),
        Emulator.Vehicle.watches[Emulator.Vehicle.RADIO_WATCH].fire(a)
    }),
    Emulator.PubSub.publish(GM_CONFIG.Events.SEND_SDARS),
    this.view.onSendSDARS.subscribe(Util.bind(this, this.sendSDARS))
}
function NetworkSettingController() {
    this.controller = new BaseController("#Network"),
    Emulator.addController(this.controller, "NetworkSettings"),
    this.view = new NetworkSettingView("#Network"),
    this.view.onAddDeviceClick.subscribe(Util.bind(this, this.addNetworkDevice)),
    this.view.onRemoveDeviceClick.subscribe(Util.bind(this, this.removeNetworkDevice)),
    this.view.onSaveDeviceClick.subscribe(Util.bind(this, this.saveNetworkDevice)),
    Emulator.setValue(GM_CONFIG.ModelKeys.Network.AuthToken, GM_CONFIG.DefaultAuthToken),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Network.DeviceList), "onChange", Util.bind(this, this.onNetworkDeviceChange)),
    Emulator.PubSub.publish(GM_CONFIG.Events.DEVICE_CONNECTION),
    Emulator.setValue(GM_CONFIG.ModelKeys.Network.DeviceList, GM_CONFIG.NETWORK_MANAGER.Default_Device_List),
    this.renderView()
}
function BluetoothSettingController() {
    this.controller = new BaseController("#Bluetooth"),
    Emulator.addController(this.controller, "BluetoothSettings"),
    this.view = new BluetoothSettingView("#Bluetooth"),
    this.view.onAddServiceClick.subscribe(Util.bind(this, this.addBluetoothService)),
    this.view.onRemoveServiceClick.subscribe(Util.bind(this, this.removeBluetoothService)),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Bluetooth.ServiceList), "onChange", Util.bind(this, this.onBluetoothServiceChange)),
    Emulator.setValue(GM_CONFIG.ModelKeys.Bluetooth.ServiceList, GM_CONFIG.BT_SERVICES.Default_Service_List),
    Emulator.PubSub.publish("BT_SERVICES_CHANGE"),
    this.renderView()
}
function GeneralSettingsController() {
    this.controller = new BaseController("#General"),
    Emulator.addController(this.controller, "GeneralSettings"),
    this.view = new GeneralSettingsView("#General"),
    this.view.onFieldChanged.subscribe(Util.bind(this, 
    function(a) {
        Emulator.setValue(a.key, a.value + "")
    })),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.IAPAuth), "onChange", Util.bind(this.view, this.view.updateField), {
        key: "iap_auth"
    }),
    Emulator.setValue(GM_CONFIG.ModelKeys.Communication.IAPAuth, ""),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Username), "onChange", Util.bind(this.view, this.view.updateField), {
        key: "username"
    }),
    Emulator.setValue(GM_CONFIG.ModelKeys.Username, "joedirt"),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.BaseServerURL), "onChange", Util.bind(this.view, this.view.updateField), {
        key: "base_server_url"
    }),
    Emulator.setValue(GM_CONFIG.ModelKeys.Communication.BaseServerURL, "sfs.oboservices.mobi"),
    Emulator.setValue(GM_CONFIG.ModelKeys.Communication.PROTOCOL, "https")
}
function SettingsOverlayController() {
    var a = this.createController("#settings_overlay", "SettingsOverlay");
    a.addObserver("#close_settings_overlay", "click", Util.toggleHideElement, {
        target: "#settings_overlay"
    }),
    a.addObserver("#group_select", "change", Util.setActiveSettingsTab),
    a.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.Status), "onChange", 
    function(a) {
        var b = x$("#Vehicle_Data");
        a.value > 0 ? Util.toggleHideElement({},
        {
            target: "#Vehicle_Data .disable-group.gps",
            show: !0
        }) : Util.toggleHideElement({},
        {
            target: "#Vehicle_Data .disable-group.gps",
            hide: !0
        })
    }),
    a.addObserver(".help-icon", "mouseover", 
    function(a, b) {
        x$(a.event.target.parentNode).find(".description").css({
            display: "block",
            top: a.event.target.offsetTop - 15 + "px",
            left: a.event.target.offsetLeft + 15 + "px"
        })
    }),
    a.addObserver(".help-icon", "mouseout", 
    function(a, b) {
        x$(a.event.target.parentNode).find(".description").css({
            display: "none"
        })
    }),
    this.VehicleConfigurationSettingController = new VehicleConfigurationSettingController,
    this.VehicleDataSettingController = new VehicleDataSettingController,
    this.RadioSettingController = new RadioSettingController,
    this.NetworkSettingController = new NetworkSettingController,
    this.BluetoothSettingController = new BluetoothSettingController,
    this.GeneralSettingsController = new GeneralSettingsController,
    Emulator.Favorites.renderFavorites()
}
function MenuPanelController() {
    MenuPanelController.baseConstructor.call(this),
    this.controller = new BaseController(".side-panel-group"),
    Emulator.addController(this.controller, "MenuController"),
    this.view = new MenuPanelView,
    this.addObserver("#home_button", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.FOCUS_APP, {
            success: function() {},
            failure: function() {},
            appID: Emulator.HOME_SCREEN_ID
        })
    }),
    Emulator.setValue(GM_CONFIG.ModelKeys.Status.Proximity, !1),
    this.view.onProximityChange.subscribe(function(a) {
        a ? Emulator.Vehicle.watches[Emulator.Vehicle.PROXIMITY_WATCH].fire(!0) : Emulator.Vehicle.watches[Emulator.Vehicle.PROXIMITY_WATCH].fire(!1)
    }),
    Emulator.setValue(GM_CONFIG.ModelKeys.Status.Ignition, !0),
    this.view.onIgnitionChange.subscribe(Util.bind(this, 
    function(a) {
        if (!a) {
            var b = [];
            x$("#applications .iframe").each(function() {
                this.id != Emulator.HOME_SCREEN_ID && b.push(this)
            });
            var c = document.getElementById("applications");
            for (var d in b) {
                var e = Emulator.getAppIDFromString(b[d].id);
                Emulator.PubSub.notify(GM_CONFIG.Events.CLOSE_APP, {
                    success: function() {},
                    failure: function() {},
                    appID: e
                })
            }
            setTimeout(Util.bind(this, 
            function() {
                this.view.setIgnitionState("off"),
                Emulator.PubSub.notify(GM_CONFIG.Events.FOCUS_APP, {
                    success: function() {},
                    failure: function() {},
                    appID: Emulator.HOME_SCREEN_ID
                })
            }), GM_CONFIG.Shutdown.TimeLimit)
        }
    })),
    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, GM_CONFIG.DRIVE_STATES.PARK),
    this.view.onGearChange.subscribe(function(a) {
        Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status) != a && Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, a)
    })
}
function RotaryPanelController() {
    this.controller = new BaseController("#rotary_container"),
    Emulator.addController(this.controller, "RotaryController"),
    this.view = new RotaryPanelView,
    this.view.onRotaryClick.subscribe(function(a) {
        Util.fireControlWatch(a, {
            watch: Emulator.Vehicle.ROTARY_WATCH
        })
    }),
    this.view.onDialChange.subscribe(function(a) {
        Emulator.Vehicle.watches[Emulator.Vehicle.ROTARY_WATCH].fire(a)
    })
}
function SoftButtonsPanelController() {
    this.controller = new BaseController("#soft_keys"),
    Emulator.addController(this.controller, "SoftButtonsPanelController"),
    this.view = new SoftButtonsPanelView
}
function SmallScreenPanelController() {
    this.rotaryControlController = new RotaryPanelController,
    this.softButtonController = new SoftButtonsPanelController,
    this.setScreenSize(Emulator.getValue(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize)),
    this.rotaryControlController.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize), "onChange", Util.bind(this, 
    function(a) {
        this.setScreenSize(a.value)
    }))
}
function SteeringWheelPanelController() {
    this.controller = new BaseController("#steering_wheel_container, #audio_container"),
    Emulator.addController(this.controller, "SteeringWheelController"),
    this.view = new SteeringWheelPanelView,
    this.view.onSteeringWheelClick.subscribe(Util.bind(this, 
    function(a) {
        this.steeringWheelClicked(a.event.target.value),
        Util.fireControlWatch(a, {
            watch: Emulator.Vehicle.SWC_WATCH
        })
    })),
    Emulator.PubSub.publish(GM_CONFIG.Events.UPDATE_VOLUME),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.UPDATE_VOLUME, Util.bind(this.view, this.view.renderVolumeIndicator))
}
function NavigationPanelController() {
    this.controller = new BaseController("#navigation_container"),
    Emulator.addController(this.controller, "NavigationController"),
    this.view = new NavigationPanelView,
    this.view.onLoadDirectionsClick.subscribe(Util.bind(this, 
    function(a, b) {
        drivingSimulator.goDirections({
            from: a.xContext.find("#start_route")[0].value,
            waypts: a.xContext.find("#way_point")[0].value,
            to: a.xContext.find("#end_route")[0].value,
            callback: this.goDirectionsCallback
        }),
        console.log("from..." + a.xContext.find("#start_route")[0].value),
        console.log("waypoint..." + a.xContext.find("#way_point")[0].value),
        console.log("to..." + a.xContext.find("#end_route")[0].value)
    })),
    this.view.onLoadLocationClick.subscribe(Util.bind(this, 
    function(a, b) {
        this.setLocation(x$("#location")[0].value)
    }));
    try {
        this.setLocation(x$("#location")[0].value)
    } catch(a) {
        console.error("Could not set initial location", a)
    }
    this.view.onSimulatorClick.subscribe(drivingSimulator.controlSimulator),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.Status), "onChange", drivingSimulator.updateDriveStatus),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.Destination), "onChange", Util.bind(this, this.destinationChanged))
}
function IgnitionOverlayController() {
    var a = new BaseController("#ignition_off_overlay");
    Emulator.addController(a, "IgnitionOverlayController"),
    a.addObserver("button", "click", 
    function() {
        window.location.reload()
    })
}
function HomeScreenController() {
    this.controller = new BaseController("#home"),
    Emulator.addController(this.controller, "HomeScreenController"),
    this.view = new HomeScreenView(Emulator.apps),
    this.view.onAppIconClick.subscribe(function(a, b) {
        x$(b).hasClass("locked") || Emulator.PubSub.notify(GM_CONFIG.Events.LAUNCH_APP, {
            success: function() {
                Emulator.log("opened app " + a)
            },
            failure: function() {},
            appID: a
        })
    }),
    this.controller.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.Status), "onChange", Util.bind(this, this.lockApps)),
    Emulator.PubSub.publish(GM_CONFIG.Events.CHANGE_APP_NAME),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.CHANGE_APP_NAME, Util.bind(this, this.setAppFriendlyName))
}
function TimePanelController() {
    var a = 1;
    this.controller = new BaseController("#date_time_container"),
    Emulator.addController(this.controller, "TimeController"),
    this.view = new TimePanelView,
    Emulator.setValue(GM_CONFIG.ModelKeys.Time.TimeMultiplier, a),
    this.view.updateTimeMultiplier(a),
    this.view.onTimeMultiplierChange.subscribe(function(a) {
        Emulator.setValue(GM_CONFIG.ModelKeys.Time.TimeMultiplier, a)
    })
}
function OnscreenController() {
    var a = function(a, b) {
        var c = b.success ? b.success: !1,
        d = b.message ? b.message: "",
        e,
        f;
        if (b.system) e = b.system.successCallback ? b.system.successCallback: function() {},
        f = b.system.failureCallback ? b.system.failureCallback: function() {};
        else {
            console.error("You must specify a system like Emulator.Phone.");
            return
        }
        c ? e.call(this, {
            success: c
        }) : f.call(this, {
            success: c,
            errorInfo: d
        })
    },
    b = this.createController("#phone_window_confirm", "PhoneConfirmController");
    b.addObserver(".cancel", "click", a, {
        success: !1,
        message: "User canceled.",
        system: Emulator.Phone
    }),
    b.addObserver(".failure", "click", a, {
        success: !1,
        message: "There was an error connecting to the phone number.",
        system: Emulator.Phone
    }),
    b.addObserver(".success", "click", a, {
        success: !0,
        system: Emulator.Phone
    }),
    b.addObserver(".cancel", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "close"
        })
    }),
    b.addObserver(".success", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "phone_window_success"
        })
    }),
    b.addObserver(".failure", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "phone_window_failure"
        })
    });
    var c = this.createController("#text_message_confirm", "TextConfirmController");
    c.addObserver(".cancel", "click", a, {
        success: !1,
        message: "User canceled.",
        system: Emulator.Text
    }),
    c.addObserver(".failure", "click", a, {
        success: !1,
        message: "There was an error sending the message.",
        system: Emulator.Text
    }),
    c.addObserver(".success", "click", a, {
        success: !0,
        system: Emulator.Text
    }),
    c.addObserver(".cancel", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "close"
        })
    }),
    c.addObserver(".success", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "text_window_success"
        })
    }),
    c.addObserver(".failure", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "text_window_failure"
        })
    });
    var d = this.createController("#email_window_confirm", "EmailConfirmController");
    d.addObserver(".cancel", "click", a, {
        success: !1,
        message: "User canceled.",
        system: Emulator.Email
    }),
    d.addObserver(".failure", "click", a, {
        success: !1,
        message: "There was an error sending the message.",
        system: Emulator.Email
    }),
    d.addObserver(".success", "click", a, {
        success: !0,
        system: Emulator.Email
    }),
    d.addObserver(".cancel", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "close"
        })
    }),
    d.addObserver(".success", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "email_window_success"
        })
    }),
    d.addObserver(".failure", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "email_window_failure"
        })
    });
    var e = this.createController(".modal-ok", "ModalOkController");
    e.addObserver(".end", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "close"
        })
    });
    var f = this.createController("#show_alert", "ShowAlertController");
    f.addObserver("#alert_primary_action", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "close",
            target: "show_alert"
        }),
        Emulator.Alert.callbackQueue.shift().primaryAction.call(this)
    }),
    f.addObserver("#alert_secondary_action", "click", 
    function() {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "close",
            target: "show_alert"
        }),
        Emulator.Alert.callbackQueue.shift().secondaryAction.call(this)
    })
}
function NativeAppController() {
    function e(a) {
        a.screenSize == GM_CONFIG.ScreenSize.LARGE ? (x$("#screen_container").removeClass("res_small"), x$("#screen_container").removeClass("res_medium"), x$("#screen_container").addClass("res_large")) : a.screenSize == GM_CONFIG.ScreenSize.SMALL ? (x$("#screen_container").removeClass("res_large"), x$("#screen_container").removeClass("res_medium"), x$("#screen_container").addClass("res_small")) : (x$("#screen_container").removeClass("res_large"), x$("#screen_container").removeClass("res_small"), x$("#screen_container").addClass("res_medium"))
    }
    function f(a) {
        var b = a.value;
        b === GM_CONFIG.ScreenSize.LARGE ? d.removeClass("hide") : d.addClass("hide"),
        gm.vehicle.getVehicleConfiguration(e)
    }
    this.view = new NativeAppView,
    Emulator.PubSub.publish(GM_CONFIG.Events.NATIVE_APP),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.NATIVE_APP, Util.bind(this, this.nativeAppRequestHandler));
    var a = function(a, b) {
        var c = a.xContext.find(b.target),
        d = b.type ? b.type: "inner";
        switch (d) {
        case "value":
            c.each(function() {
                this.value = a.value
            });
            break;
        case "inner":
            c.inner(a.value)
        }
    };
    this.controller = new BaseController("#native_application_windows"),
    Emulator.addController(this.controller, "NativeAppController"),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.OutgoingPhone), "onChange", a, {
        target: "#phone_number_confirm",
        type: "value"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.OutgoingPhone), "onChange", a, {
        target: "#phone_window_success .window-body",
        type: "inner"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.OutgoingPhone), "onChange", a, {
        target: "#phone_window_failure .window-body",
        type: "inner"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.TextNum), "onChange", a, {
        target: "#text_number_confirm",
        type: "value"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.TextMessage), "onChange", a, {
        target: "#text_message_confirm textarea",
        type: "inner"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.EmailTo), "onChange", a, {
        target: "#email_to",
        type: "value"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.EmailFrom), "onChange", a, {
        target: "#email_from",
        type: "inner"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.EmailSubject), "onChange", a, {
        target: "#email_subject",
        type: "value"
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.EmailBody), "onChange", a, {
        target: "#email_window_confirm textarea",
        type: "inner"
    });
    var b = x$("#applications")[0],
    c = x$("#screen_container")[0],
    d = x$("#app_window_bottom_right");
    f({
        value: Emulator.getValue(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize)
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize), "onChange", f)
}
function DebugPanelController() {
    this.controller = new BaseController("#debug_container"),
    Emulator.addController(this.controller, "DebugPanelController"),
    this.view = new DebugPanelView,
    this.view.onReloadAppClick.subscribe(Util.bind(this, this.reloadApp)),
    this.view.onReloadAllClick.subscribe(Util.bind(this, this.reloadAll)),
    this.view.onKillAppClick.subscribe(Util.bind(this, this.killCurrentApp)),
    this.view.onKillAllClick.subscribe(Util.bind(this, this.killAllApps)),
    this.view.onVConfigClick.subscribe(Util.bind(this, 
    function(a) {
        if (x$("#settings_overlay")[0].offsetLeft < 0) {
            var b = x$("#settings_overlay");
            Util.toggleHideElement({
                xContext: b,
                event: a.event
            },
            {
                target: "#settings_overlay"
            }),
            Util.setActiveSettingsTab({
                xContext: b,
                event: {
                    target: {
                        value: "Vehicle_Config"
                    }
                }
            })
        }
    })),
    this.view.onVDataClick.subscribe(Util.bind(this, 
    function(a) {
        if (x$("#settings_overlay")[0].offsetLeft < 0) {
            var b = x$("#settings_overlay");
            Util.toggleHideElement({
                xContext: b,
                event: a.event
            },
            {
                target: "#settings_overlay"
            }),
            Util.setActiveSettingsTab({
                xContext: b,
                event: {
                    target: {
                        value: "Vehicle_Data"
                    }
                }
            })
        }
    })),
    this.view.onTBDClick.subscribe(Util.bind(this, 
    function(a) {
        console.log("You clicked TBD")
    })),
    this.view.onNetworkClick.subscribe(Util.bind(this, 
    function(a) {
        if (x$("#settings_overlay")[0].offsetLeft < 0) {
            var b = x$("#settings_overlay");
            Util.toggleHideElement({
                xContext: b,
                event: a.event
            },
            {
                target: "#settings_overlay"
            }),
            Util.setActiveSettingsTab({
                xContext: b,
                event: {
                    target: {
                        value: "Network"
                    }
                }
            })
        }
    }))
}
function InteractionSelectorController() {
    this.controller = new BaseController("#interaction_selectors"),
    Emulator.addController(this.controller, "InteractionSelectorController"),
    this.view = new InteractionSelectorView,
    this.onCurrentAppChanged = new Channel,
    this.onCurrentAppChanged.subscribe(Util.bind(this.view, this.view.onCurrentAppChanged))
}
function POISearchController() {
    this.controller = new BaseController("#poisearch"),
    Emulator.addController(this.controller, "POISearchController"),
    this.view = new POISearchView,
    this.view.onSubmitPOISearchClick.subscribe(Util.bind(this, this.submitPOISearch)),
    this.view.onRequestAutocompleteResults.subscribe(Util.bind(this, this.requestAutocompleteResults)),
    Emulator.PubSub.publish(GM_CONFIG.POISearch.APP_WATCH),
    Emulator.PubSub.publish(GM_CONFIG.Events.SEARCH_RESULTS),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.SEARCH_RESULTS, Util.bind(this, this.searchResultsHandler))
}
function PhoneSettingsController() {
    this.controller = new BaseController("#Phone"),
    Emulator.addController(this.controller, "PhoneSettings"),
    this.view = new PhoneSettingsView("#Phone"),
    Emulator.PubSub.publish(GM_CONFIG.Events.SEND_FROM_PHONE),
    Emulator.PubSub.publish(GM_CONFIG.Events.SEND_SPP_DATA),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.SEND_SPP_DATA, Util.bind(this, this.view.showSppData)),
    this.view.onSendDataClick.subscribe(Util.bind(this, this.sendDataToVehicle))
}
function MediaPlayerController() {
    this.controller = new BaseController("#video_container"),
    Emulator.addController(this.controller, "MedaPlayerController"),
    this.player = document.mediaPlayer,
    this.audioHandle = 2e4,
    this.audioCallbacks = {},
    this.ttsHandle = 3e4,
    this.ttsCallbacks = {},
    this.videoHandle = 1e4,
    this.videoCallback = null,
    this.videoIsPlaying = !1,
    this.currentVideoAppID = -1,
    this.currentVideoHandle = -1,
    this.currentVolume = 1,
    Emulator.PubSub.publish(GM_CONFIG.Events.PLAY_VIDEO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.PLAY_VIDEO, Util.bind(this, this.playVideo)),
    Emulator.PubSub.publish(GM_CONFIG.Events.STOP_VIDEO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.STOP_VIDEO, Util.bind(this, this.stopVideo)),
    Emulator.PubSub.publish(GM_CONFIG.Events.PAUSE_VIDEO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.PAUSE_VIDEO, Util.bind(this, this.pauseVideo)),
    Emulator.PubSub.publish(GM_CONFIG.Events.SEEK_VIDEO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.SEEK_VIDEO, Util.bind(this, this.seekVideo)),
    Emulator.PubSub.publish(GM_CONFIG.Events.PLAY_AUDIO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.PLAY_AUDIO, Util.bind(this, this.playAudio)),
    Emulator.PubSub.publish(GM_CONFIG.Events.STOP_AUDIO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.STOP_AUDIO, Util.bind(this, this.stopAudio)),
    Emulator.PubSub.publish(GM_CONFIG.Events.PAUSE_AUDIO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.PAUSE_AUDIO, Util.bind(this, this.pauseAudio)),
    Emulator.PubSub.publish(GM_CONFIG.Events.SEEK_AUDIO),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.SEEK_AUDIO, Util.bind(this, this.seekAudio)),
    Emulator.PubSub.publish(GM_CONFIG.Events.VOLUME_UP_CLICKED),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.VOLUME_UP_CLICKED, Util.bind(this, this.volumeUp)),
    Emulator.PubSub.publish(GM_CONFIG.Events.VOLUME_DOWN_CLICKED),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.VOLUME_DOWN_CLICKED, Util.bind(this, this.volumeDown)),
    Emulator.PubSub.publish(GM_CONFIG.Events.START_TTS),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.START_TTS, Util.bind(this, this.startTTS)),
    Emulator.PubSub.publish(GM_CONFIG.Events.STOP_TTS),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.STOP_TTS, Util.bind(this, this.stopTTS)),
    Emulator.PubSub.publish(GM_CONFIG.Events.APP_CLOSED),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.APP_CLOSED, Util.bind(this, this.appClosed)),
    Emulator.PubSub.publish(GM_CONFIG.Events.MEDIA_PLAYER_LIST),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.MEDIA_PLAYER_LIST, Util.bind(this, this.getMediaPlayerList)),
    Emulator.PubSub.publish(GM_CONFIG.Events.MEDIA_PLAYER_RESULTNUM),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.MEDIA_PLAYER_RESULTNUM, Util.bind(this, this.getMediaPlayerResultsNum))
}
function AppController() {
    this.controller = new BaseController("#video_container"),
    Emulator.addController(this.controller, "AppController"),
    Emulator.PubSub.publish(GM_CONFIG.Events.CREATE_APP),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.CREATE_APP, Util.bind(this, this.createApp)),
    Emulator.PubSub.publish(GM_CONFIG.Events.FOCUS_APP),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.FOCUS_APP, Util.bind(this, this.requestFocus)),
    Emulator.PubSub.publish(GM_CONFIG.Events.CLOSE_APP),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.CLOSE_APP, Util.bind(this, this.closeApp)),
    Emulator.PubSub.publish(GM_CONFIG.Events.LAUNCH_APP),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.LAUNCH_APP, Util.bind(this, this.launchApp)),
    Emulator.PubSub.publish(GM_CONFIG.Events.DELETE_APP),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.DELETE_APP, Util.bind(this, this.deleteApp)),
    Emulator.PubSub.publish(GM_CONFIG.Events.APP_STATE_CHANGE),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.APP_STATE_CHANGE, Util.bind(this, this.updateAppState)),
    Emulator.PubSub.publish(GM_CONFIG.Events.APP_CHANGE_ICON),
    Emulator.PubSub.subscribe(GM_CONFIG.Events.APP_CHANGE_ICON, Util.bind(this, this.changeIcon)),
    Emulator.PubSub.publish(GM_CONFIG.Events.APP_INFO_CHANGE),
    this.autoStartApps()
}
function MenuPanelView() {
    MenuPanelView.baseConstructor.call(this, ".side-panel-group"),
    this.addObserver("#settings", "click", Util.toggleHideElement, {
        target: "#settings_overlay"
    }),
    this.addObserver("#favorites_button", "click", 
    function(a) {
        if (x$("#settings_overlay")[0].offsetLeft < 0) {
            var b = x$("#settings_overlay");
            Util.toggleHideElement({
                xContext: b,
                event: a.event
            },
            {
                target: "#settings_overlay"
            }),
            Util.setActiveSettingsTab({
                xContext: b,
                event: {
                    target: {
                        value: "Favorites"
                    }
                }
            })
        }
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Status.Proximity), "onChange", Util.bind(this, 
    function(a, b) {
        this.setProximityState(a.value)
    }), {}),
    this.addObserver("#prox-led, #prox-on, #prox-off", "click", Util.bind(this, 
    function(a, b) {
        Emulator.getValue(GM_CONFIG.ModelKeys.Status.Proximity) ? (Emulator.setValue(GM_CONFIG.ModelKeys.Status.Proximity, !1), this.onProximityChange.fire(!1)) : (Emulator.setValue(GM_CONFIG.ModelKeys.Status.Proximity, !0), this.onProximityChange.fire(!0))
    })),
    this.onProximityChange = new Channel,
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Status.Ignition), "onChange", Util.bind(this, 
    function(a, b) {
        this.setIgnitionState(a.value ? "on": "pending")
    }), {}),
    this.addObserver("#ignition", "click", Util.bind(this, 
    function(a, b) {
        Emulator.getValue(GM_CONFIG.ModelKeys.Status.Ignition) ? (Emulator.setValue(GM_CONFIG.ModelKeys.Status.Ignition, !1), this.onIgnitionChange.fire(!1)) : (Emulator.setValue(GM_CONFIG.ModelKeys.Status.Ignition, !0), this.onIgnitionChange.fire(!0))
    })),
    this.onIgnitionChange = new Channel,
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.Status), "onChange", Util.bind(this, 
    function(a, b) {
        this.setGearState(a.value)
    }), {}),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.VehicleData.Engine_Information_1_LS.shift_lever_position.model.key), "onChange", Util.bind(this, 
    function(a, b) {
        var c = GM_CONFIG.DRIVE_STATES.PARK;
        a.value == 2 ? c = GM_CONFIG.DRIVE_STATES.REVERSE: a.value == 3 ? c = GM_CONFIG.DRIVE_STATES.NEUTRAL: a.value > 3 && a.value < 10 && (c = GM_CONFIG.DRIVE_STATES.DRIVE),
        this.setGearState(c)
    }), {});
    var a = Util.bind(this, 
    function(a, b) {
        this.addObserver(a, "click", 
        function(a) {
            Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status) != b && Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, b)
        })
    }),
    b = this.getGearButtons();
    for (var c in b) a(b[c].selector, b[c].status);
    this.onGearChange = new Channel
}
function VehicleConfigurationSettingView() {
    VehicleConfigurationSettingView.baseConstructor.call(this, "#Vehicle_Config"),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.VehicleConfig.ScreenSize), "onChange", 
    function(a) {
        var b = x$("#screen_container"),
        c = a.value;
        gm.vehicle.getVehicleConfiguration(function(a) {
            var c = a,
            d = {
                width: c.screenResolution.width,
                height: c.screenResolution.height
            };
            b.find("#native_application_windows").css(d),
            b.find("#video_container").css(d),
            b.find("iframe").css(d)
        })
    }),
    this.renderLanguages(GM_CONFIG.Languages);
    for (var a in GM_CONFIG.VehicleConfiguration) this.initField(a)
}
function VehicleDataSettingView() {
    this.callSuper("#Vehicle_Data"),
    this.renderConfig("#Vehicle_Data", GM_CONFIG.VehicleData);
    for (var a in GM_CONFIG.VehicleData) for (var b in GM_CONFIG.VehicleData[a]) {
        var c = GM_CONFIG.VehicleData[a][b];
        if (c.slider) {
            var d = c.slider.steps ? c.slider.steps: GM_CONFIG.sliderSteps,
            e = {
                sliderid: b + "_slider",
                displayid: b,
                length: GM_CONFIG.sliderLength,
                from: c.slider.from,
                to: c.slider.to,
                count: d,
                decimals: c.slider.decimals,
                model: c.model.key
            };
            this.addObserver("#" + b + "_slider", "change", Util.bind(this, 
            function(a, b) {
                this.onSliderChange.fire(a.event.target.value, b)
            }), e),
            this.addObserver("#" + b, "change", Util.bind(this, 
            function(a, b) {
                this.onSliderChange.fire(a.event.target.value, b)
            }), e),
            c.model && this.addObserver(Emulator.getValueRef(c.model.key), "onChange", Util.bind(this, 
            function(a, b) {
                this.setSliderValue(b.sliderid, a.value)
            }), e)
        } else c.model ? (this.addObserver("#" + b, "change", Util.setModelFromFieldValue, c.model), this.addObserver(Emulator.getValueRef(c.model.key), "onChange", Util.changeValue, {
            target: "#" + b
        })) : c.select && a !== "DTC_Table_Entry" && this.addObserver("#" + b, "change", Util.bind(this, 
        function(a, b) {
            this.onSelectChange.fire(a.event.target.value, b)
        }))
    }
    this.addObserver(Emulator.getValueRef(GM_CONFIG.VehicleData.Outside_Air_Temperature_LS.outside_air_temp.model.key), "onChange", Util.bind(this, 
    function(a) {
        x$("#temp_value").inner(a.value)
    })),
    this.addObserver("#Date_and_Time_LS ~ .field input, #Date_and_Time_LS ~ .field select", "focus", Util.bind(this, 
    function(a) {
        this.onTimeEdit.fire()
    })),
    this.addObserver("#Date_and_Time_LS ~ .field input, #Date_and_Time_LS ~ .field select", "blur", Util.bind(this, 
    function(a) {
        var b = {};
        x$("#Date_and_Time_LS ~ .field input, #Date_and_Time_LS ~ .field select").each(function() {
            b[this.id] = this.value
        }),
        this.onTimeChange.fire(b)
    })),
    this.addObserver("#odometer", "change", Util.setModelFromFieldValue, {
        key: GM_CONFIG.ModelKeys.Driving.OdometerOffset
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.Status), "onChange", Util.bind(this, 
    function(a, b) {
        a.value == GM_CONFIG.DRIVE_STATES.PARK && (Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Stability_LS.yaw_rate.model.key, 0), Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Stability_LS.long_accel.model.key, 0), Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Stability_LS.lat_accel.model.key, 0))
    }), {}),
    this.onSliderChange = new Channel,
    this.onSelectChange = new Channel,
    this.onTimeChange = new Channel,
    this.onTimeEdit = new Channel,
    this.onAddTableClick = new Channel,
    this.onRemoveTableClick = new Channel,
    this.onSaveTableClick = new Channel
}
function RadioSettingView() {
    var a = "#f5f7bc";
    RadioSettingView.baseConstructor.call(this, "#Radio"),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Radio.StationBand), "onChange", Util.changeValue, {
        target: "#station_band"
    }),
    this.addObserver("#station_band", "change", Util.changeCss, {
        css: {
            "background-color": a
        }
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Radio.StationChannel), "onChange", Util.changeValue, {
        target: "#station_channel"
    }),
    this.addObserver("#station_channel", "change", Util.changeCss, {
        css: {
            "background-color": a
        }
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Radio.StationTitle), "onChange", Util.changeValue, {
        target: "#station_title"
    }),
    this.addObserver("#station_title", "change", Util.changeCss, {
        css: {
            "background-color": a
        }
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Radio.SongTitle), "onChange", Util.changeValue, {
        target: "#song_title"
    }),
    this.addObserver("#song_title", "change", Util.changeCss, {
        css: {
            "background-color": a
        }
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Radio.SongArtist), "onChange", Util.changeValue, {
        target: "#song_artist"
    }),
    this.addObserver("#song_artist", "change", Util.changeCss, {
        css: {
            "background-color": a
        }
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Radio.SongRDS), "onChange", Util.changeValue, {
        target: "#song_rds"
    }),
    this.addObserver("#song_rds", "change", Util.changeCss, {
        css: {
            "background-color": a
        }
    }),
    this.addObserver("#change_radio", "click", Util.bind(this, 
    function(a) {
        var b = this;
        a.xContext.find("input, select").each(function() {
            x$(this).css({
                "background-color": "transparent"
            }),
            b.onRadioPropertyChange.fire(this.id, this.value)
        }),
        this.onRadioChange.fire()
    })),
    this.addObserver("#send_sdars", "click", Util.bind(this, 
    function(a) {
        this.onSendSDARS.fire({
            SID: a.xContext.find("#sdars_sid")[0].value,
            dataAuthorization: a.xContext.find("#sdars_data_authorization")[0].value,
            data: a.xContext.find("#sdars_data")[0].value
        })
    })),
    this.onRadioPropertyChange = new Channel,
    this.onRadioChange = new Channel,
    this.onSendSDARS = new Channel
}
function NetworkSettingView(a) {
    NetworkSettingView.baseConstructor.call(this, a),
    this.container = a,
    this.addObserver("#network_connectivity", "change", Util.setModelFromFieldValue, {
        key: GM_CONFIG.ModelKeys.Network.NetworkConnectivity
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Network.NetworkConnectivity), "onChange", Util.changeValue, {
        target: "#network_connectivity"
    }),
    this.addObserver("#auth_token", "change", Util.setModelFromFieldValue, {
        key: GM_CONFIG.ModelKeys.Network.AuthToken
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Network.AuthToken), "onChange", Util.changeValue, {
        target: "#auth_token"
    }),
    this.onAddDeviceClick = new Channel,
    this.onRemoveDeviceClick = new Channel,
    this.onSaveDeviceClick = new Channel
}
function BluetoothSettingView(a) {
    BluetoothSettingView.baseConstructor.call(this, a),
    this.container = a,
    this.onAddServiceClick = new Channel,
    this.onRemoveServiceClick = new Channel
}
function GeneralSettingsView(a) {
    GeneralSettingsView.baseConstructor.call(this, a),
    this.container = a,
    this.onFieldChanged = new Channel,
    this.addObserver("input", "change", Util.bind(this, 
    function(a) {
        var b = this.cleanse(a);
        this.onFieldChanged.fire({
            key: a.event.target.id,
            value: b
        })
    })),
    this.addObserver("#" + GM_CONFIG.ModelKeys.Communication.PROTOCOL, "change", Util.bind(this, this.onProtocolChanged), {
        key: GM_CONFIG.ModelKeys.Communication.PROTOCOL
    }),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Communication.PROTOCOL), "onChange", Util.bind(this, this.onProtocolChanged), {
        target: "#" + GM_CONFIG.ModelKeys.Communication.PROTOCOL
    })
}
function RotaryPanelView() {
    RotaryPanelView.baseConstructor.call(this, "#rotary_container");
    var a = x$(".rotary-dial"),
    b = x$(".invisible-overlay"),
    c = x$(".rotary-overlay"),
    d = 0,
    e = 0,
    f = 0,
    g = 0,
    h = Util.bind(this, 
    function(b) {
        var c = b.clientX - d + (b.clientY - e),
        g = a[0],
        h = 0,
        i = 0;
        if (g.offsetParent) do h += g.offsetLeft,
        i += g.offsetTop;
        while (g = g.offsetParent);
        var j = b.clientY - (a[0].offsetWidth / 2 + i),
        k = b.clientX - (a[0].offsetHeight / 2 + h),
        l = Math.atan(j / k) * 180 / Math.PI;
        l += 90,
        b.clientX < a[0].offsetHeight / 2 + h && (l += 180),
        l >= 0 && l < 36 && (l = 0),
        l >= 36 && l < 72 && (l = 36),
        l >= 72 && l < 108 && (l = 72),
        l >= 108 && l < 144 && (l = 108),
        l >= 144 && l < 180 && (l = 144),
        l >= 180 && l < 216 && (l = 180),
        l >= 216 && l < 252 && (l = 216),
        l >= 252 && l < 288 && (l = 252),
        l >= 288 && l < 324 && (l = 288),
        l >= 324 && l < 360 && (l = 324),
        f != l && (f == 0 && l == 324 ? (this.onDialChange.fire("RC_CCW"), console.log("RC_CCW on DOM")) : f == 324 && l == 0 ? (this.onDialChange.fire("RC_CW"), console.log("RC_CW on DOM")) : l - f <= 0 ? (this.onDialChange.fire("RC_CCW"), console.log("RC_CCW on DOM")) : (this.onDialChange.fire("RC_CW"), console.log("RC_CW on DOM"))),
        f = l,
        a.css({
            "-webkit-transform": "rotate(" + l + "deg)"
        })
    }),
    i = Util.bind(this, 
    function(a) {
        b.removeClass("visible"),
        x$(window).un("mouseup", i, !1).un("mousemove", h, !1),
        d = a.clientX,
        e = a.clientY
    });
    c.on("mousedown", Util.bind(this, 
    function(a) {
        b.addClass("visible"),
        d = a.clientX,
        e = a.clientY,
        x$(window).on("mouseup", i, !1).on("mousemove", h, !1)
    }), !1),
    this.addObserver(".d-pad, .rotary-select", "click", Util.bind(this, 
    function(a) {
        this.onRotaryClick.fire(a)
    })),
    this.onRotaryClick = new Channel,
    this.onDialChange = new Channel
}
function SoftButtonsPanelView() {
    SoftButtonsPanelView.baseConstructor.call(this, "#soft_keys"),
    this.addObserver("button", "click", Util.fireControlWatch, {
        watch: Emulator.Vehicle.SOFT_KEY_WATCH
    })
}
function SteeringWheelPanelView() {
    SteeringWheelPanelView.baseConstructor.call(this, "#steering_wheel_container, #audio_container"),
    this.addObserver("button", "click", Util.bind(this, 
    function(a) {
        this.onSteeringWheelClick.fire(a)
    })),
    this.onSteeringWheelClick = new Channel,
    this.xVol = x$("#app_window_volume"),
    this.xVol.on("webkitTransitionEnd", Util.bind(this, 
    function() {
        this.xVol.addClass("hide"),
        this.endTransition()
    })),
    this.timer = null
}
function NavigationPanelView() {
    NavigationPanelView.baseConstructor.call(this, "#navigation_container"),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Driving.DirectionsLoaded), "onChange", 
    function(a, b) {
        if (a.value) {
            var c = a.xContext.find(".sim-prereq").removeClass("disabled");
            c.each(function() {
                this.disabled = !1
            }),
            x$("#load_route_prompt").addClass("hide")
        }
    }),
    this.addObserver("#load_directions", "click", Util.bind(this, 
    function(a) {
        this.onLoadDirectionsClick.fire(a)
    })),
    this.addObserver(".sim", "click", Util.bind(this, 
    function(a) {
        this.onSimulatorClick.fire(a)
    })),
    this.addObserver("#map", "now", 
    function() {}),
    this.addObserver("#load_location", "click", Util.bind(this, 
    function(a) {
        this.onLoadLocationClick.fire(a)
    })),
    this.addObserver("#navigation_container .toggle a", "click", 
    function(a) {
        var b = a.event;
        b.preventDefault(),
        x$("#nav_location, #nav_route").addClass("hide"),
        b.target.innerHTML.toLowerCase() == "route" ? (x$(".toggle .route").addClass("selected"), x$(".toggle .location").removeClass("selected"), x$("#nav_route").removeClass("hide")) : (x$(".toggle .route").removeClass("selected"), x$(".toggle .location").addClass("selected"), x$("#nav_location").removeClass("hide"))
    }),
    this.onLoadDirectionsClick = new Channel,
    this.onSimulatorClick = new Channel,
    this.onLoadLocationClick = new Channel,
    this.onError = new Channel,
    this.onError.subscribe(this.showError)
}
function HomeScreenView(a) {
    HomeScreenView.baseConstructor.call(this, "#home"),
    this.render(a),
    this.onAppIconClick = new Channel
}
function TimePanelView() {
    TimePanelView.baseConstructor.call(this, "#date_time_container"),
    this.addObserver(".speed-selector", "change", Util.bind(this, 
    function(a) {
        var b = a.event.target;
        this.onTimeMultiplierChange.fire(parseFloat(b.options[b.selectedIndex].value))
    })),
    this.addObserver("#set_time", "click", Util.bind(this, 
    function(a) {
        if (this.isSettingsClosed()) {
            var b = x$("#settings_overlay");
            Util.toggleHideElement({
                xContext: b,
                event: a.event
            },
            {
                target: "#settings_overlay"
            }),
            Util.setActiveSettingsTab({
                xContext: b,
                event: a.event
            });
            var c = x$("#Date_and_Time_LS")[0].offsetParent.offsetTop - 55;
            b.find("#" + a.event.target.value)[0].scrollTop = c
        }
    })),
    this.setClockInterval(Emulator.getValue(GM_CONFIG.ModelKeys.Time.TimeMultiplier)),
    this.addObserver(Emulator.getValueRef(GM_CONFIG.ModelKeys.Time.TimeMultiplier), "onChange", Util.bind(this, 
    function(a) {
        clearInterval(this.clockInterval),
        this.setClockInterval(a.value),
        this.updateTimeMultiplier(a.value)
    })),
    this.onTimeMultiplierChange = new Channel
}
function NativeAppView() {
    NativeAppView.baseConstructor.call(this, "#native_application_windows"),
    x$("#native_application_windows .close").on("click", Util.bind(this, 
    function() {
        x$("#video_container").hasClass("hide") || Emulator.PubSub.notify(GM_CONFIG.Events.STOP_VIDEO),
        x$("#show_alert").hasClass("hide") || Emulator.Alert.callbackQueue.shift(),
        this.hideNativeApp()
    })),
    this.alertQueue = []
}
function DebugPanelView() {
    DebugPanelView.baseConstructor.call(this, "#debug_container"),
    this.onReloadAppClick = new Channel,
    this.onReloadAllClick = new Channel,
    this.onKillAppClick = new Channel,
    this.onKillAllClick = new Channel,
    this.onVConfigClick = new Channel,
    this.onVDataClick = new Channel,
    this.onTBDClick = new Channel,
    this.onNetworkClick = new Channel,
    this.addObserver("button", "click", Util.bind(this, 
    function(a) {
        var b = a.event.target.value;
        switch (b) {
        case "rldapp":
            this.onReloadAppClick.fire(a);
            break;
        case "rldall":
            this.onReloadAllClick.fire(a);
            break;
        case "killapp":
            this.onKillAppClick.fire(a);
            break;
        case "killall":
            this.onKillAllClick.fire(a);
            break;
        case "vehConfig":
            this.onVConfigClick.fire(a);
            break;
        case "vehData":
            this.onVDataClick.fire(a);
            break;
        case "tbd":
            this.onTBDClick.fire(a);
            break;
        case "network":
            this.onNetworkClick.fire(a)
        }
    }))
}
function InteractionSelectorView() {
    InteractionSelectorView.baseConstructor.call(this, "#interaction_selectors"),
    this.xContainer = x$("#interaction_selectors"),
    this.xToggle = this.xContainer.find(".toggle");
    var a = this;
    this.xToggle.on("click", 
    function() {
        a.toggleVisible()
    })
}
function POISearchView() {
    POISearchView.baseConstructor.call(this, "#poisearch"),
    this.onSubmitPOISearchClick = new Channel,
    this.onRequestAutocompleteResults = new Channel,
    x$("#poisearch-btn").on("click", Util.bind(this, 
    function(a) {
        Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
            method: "show",
            target: "poisearch"
        })
    })),
    x$("#poisearch .search-btn").on("click", Util.bind(this, 
    function() {
        var a = x$("#poisearch .search-text")[0].value;
        this.onSubmitPOISearchClick.fire({
            search: a
        })
    })),
    xui.extend(autocompletePlugin)
}
function PhoneSettingsView(id) {
    PhoneSettingsView.baseConstructor.call(this, id),
    this.container = id,
    this.onSendDataClick = new Channel,
    this.addObserver("#sendData", "click", Util.bind(this, 
    function(r) {
        var data = x$("#phoneData")[0].value;
        try {
            data = eval("(" + data + ")")
        } catch(ex) {}
        console.log("sendataclick"),
        this.onSendDataClick.fire({
            data: data
        })
    }))
}
var Util = {
    toggleHideElement: function(a, b) {
        var c = x$(b.target),
        d = !1;
        b.show ? (c.removeClass("hide"), d = !0) : b.hide && (c.addClass("hide"), d = !0),
        d || (c[0].className.match(/hide/) ? c.removeClass("hide") : c.addClass("hide")),
        b.target == "#settings_overlay" && (c[0].className.match(/hide/) ? x$("#settings").removeClass("on") : x$("#settings").addClass("on"))
    },
    storeCookie: function(a, b) {
        if (!b.key) {
            console.error("Must specify a key.");
            return
        }
        Emulator.storage.save({
            key: b.key,
            value: a.value + ""
        })
    },
    setModelFromFieldValue: function(a, b) {
        if (!b.key) {
            console.error("Must specify a key.");
            return
        }
        if (b.regex) {
            var c = x$(a.event.target.parentNode).find(".field-error");
            a.event.target.value.match(b.regex) ? (Emulator.setValue(b.key, a.event.target.value), c.css({
                display: "none"
            })) : (c.inner(b.message), c.css({
                display: "inline"
            }), a.event.target.value = Emulator.getValue(b.key))
        } else {
            var d = Emulator.getValue(b.key);
            d != a.event.target.value && Emulator.setValue(b.key, a.event.target.value)
        }
    },
    changeValue: function(a, b) {
        if (!b.target) {
            console.error("Must specify a target item.");
            return
        }
        var c = x$(b.target);
        c.each(function() {
            this.value = a.value
        })
    },
    fireControlWatch: function(a, b) {
        Emulator.Vehicle.watches[b.watch].fire(a.event.target.value)
    },
    setActiveSettingsTab: function(a, b) {
        a.xContext.find("div").removeClass("active"),
        a.xContext.find("#" + a.event.target.value).addClass("active"),
        a.xContext.find("#group_select")[0].value = a.event.target.value
    },
    changeCss: function(a, b) {
        if (!b.css) {
            console.error("Must specify css option.");
            return
        }
        x$(a.event.target).css(b.css)
    },
    extend: function(a, b) {
        function c() {}
        c.prototype = b.prototype,
        a.prototype = new c,
        a.prototype.constructor = a,
        a.baseConstructor = b,
        a.prototype.callSuper = function() {
            a.baseConstructor.apply(this, arguments)
        },
        b.base && (b.prototype.base = b.base),
        a.base = b.prototype
    },
    bind: function(a, b, c) {
        return null == c ? 
        function() {
            return b.apply(a, arguments)
        }: function() {
            return b.apply(a, c)
        }
    },
    kpagToPsi: function(a, b) {
        return (a * GM_CONFIG.KPAG_IN_PSI).toFixed(b)
    },
    kmToMiles: function(a, b) {
        return (a * GM_CONFIG.KM_IN_MILES).toFixed(b)
    },
    cmToFeet: function(a, b) {
        return (a * GM_CONFIG.CM_IN_FEET).toFixed(b)
    }
};
define("controller/util", 
function() {});
var BaseController = function(a) {
    var b = this;
    b.contexts = [],
    x$(a).each(function() {
        b.contexts.push(this)
    }),
    this.observers = []
};
BaseController.prototype.destroy = function() {
    self = this;
    var a = this.observers;
    for (var b in a) {
        for (var c in this.contexts) a[b].hdl && x$(this.contexts[c]).find(a[b].target).un(a[b].event, a[b].hdl);
        a[b].channel && a[b].channel.unsubscribe(a[b].modelGUID)
    }
    self.contexts = null,
    self.observers = null,
    self = null
},
BaseController.prototype.addObserver = function(a, b, c, d) {
    var e = [];
    for (var f in this.contexts) {
        var g = x$(this.contexts[f]);
        if (b == "now") return c({
            target: g.find(a),
            xContext: g
        },
        d),
        null;
        var h,
        i,
        j;
        typeof a == "string" || a.addEventListener ? (h = function(a) {
            c({
                event: a,
                xContext: g
            },
            d)
        },
        e.push(g.find(a).on(b, h))) : typeof a == "object" && (a.model !== undefined ? j = a.channel[b].subscribe(function(b) {
            c({
                value: a.model.get(a.key),
                oldValue: b.oldValue,
                xContext: g
            },
            d)
        }) : a.msgRef !== undefined && a.channel[b].subscribe(c({
            message: a.message,
            xContext: g
        },
        d)), i = a.channel[b], e.push(a)),
        this.observers.push({
            target: a,
            event: b,
            hdl: h,
            channel: i,
            modelGUID: j
        })
    }
    return e
},
define("controller/base-controller", 
function() {}),
UIControllerBase.prototype.addObserver = function(a, b, c, d) {
    var e = this.controller.addObserver(a, b, c, d);
    if (e) {
        var f,
        g;
        for (f in e) if (e[f]) for (g = 0; g < e[f].length; g++) e[f][g] && this.ui.push({
            element: e[f][g],
            type: b,
            option: d,
            selector: a
        })
    }
    return {
        el: e,
        ui: this.ui
    }
},
UIControllerBase.prototype.getUI = function() {
    return this.ui
},
define("controller/ui-controller-base", 
function() {});
var GM_CONFIG = {};
GM_CONFIG.BlockEventId = "GM_EMULATOR_BLOCK_EVENTS",
GM_CONFIG.ModelKeys = {},
GM_CONFIG.ModelKeys.NetworkData = "Network_Data_",
GM_CONFIG.ModelKeys.BTServicesData = "BTServices_Data_",
GM_CONFIG.ModelKeys.VehicleConfig = {
    Brand: "theme",
    ScreenSize: "screenSize",
    NavEngine: "navEngine",
    Proximity: "proximity",
    Input: "input",
    Language: "language"
},
GM_CONFIG.ModelKeys.Radio = {},
GM_CONFIG.ModelKeys.Radio.prefix = "Radio_",
GM_CONFIG.ModelKeys.Radio.StationBand = GM_CONFIG.ModelKeys.Radio.prefix + "station_band",
GM_CONFIG.ModelKeys.Radio.StationChannel = GM_CONFIG.ModelKeys.Radio.prefix + "station_channel",
GM_CONFIG.ModelKeys.Radio.StationTitle = GM_CONFIG.ModelKeys.Radio.prefix + "station_title",
GM_CONFIG.ModelKeys.Radio.SongTitle = GM_CONFIG.ModelKeys.Radio.prefix + "song_title",
GM_CONFIG.ModelKeys.Radio.SongArtist = GM_CONFIG.ModelKeys.Radio.prefix + "song_artist",
GM_CONFIG.ModelKeys.Radio.SongRDS = GM_CONFIG.ModelKeys.Radio.prefix + "song_rds",
GM_CONFIG.ModelKeys.Network = {},
GM_CONFIG.ModelKeys.Network.prefix = "Network_",
GM_CONFIG.ModelKeys.Network.NetworkConnectivity = GM_CONFIG.ModelKeys.Network.prefix + "network_connectivity",
GM_CONFIG.ModelKeys.Network.AuthToken = GM_CONFIG.ModelKeys.Network.prefix + "auth_token",
GM_CONFIG.ModelKeys.Network.DeviceList = GM_CONFIG.ModelKeys.Network.prefix + "device_list",
GM_CONFIG.ModelKeys.Network.SppToBackOffice = GM_CONFIG.ModelKeys.Network.prefix + "SppToBackOffice",
GM_CONFIG.ModelKeys.Network.SppToInternet = GM_CONFIG.ModelKeys.Network.prefix + "SppToInternet",
GM_CONFIG.ModelKeys.Network.SppInternetFunction = GM_CONFIG.ModelKeys.Network.prefix + "SppInternetFunction",
GM_CONFIG.ModelKeys.Network.SppParameters = GM_CONFIG.ModelKeys.Network.prefix + "SppParameters",
GM_CONFIG.ModelKeys.Network.ActiveDeviceOverride = GM_CONFIG.ModelKeys.Network.prefix + "ActiveDeviceOverride",
GM_CONFIG.ModelKeys.Network.NetworkPriority = "network_priority",
GM_CONFIG.ModelKeys.Bluetooth = {},
GM_CONFIG.ModelKeys.Bluetooth.prefix = "Bluetooth_",
GM_CONFIG.ModelKeys.Bluetooth.ServiceList = GM_CONFIG.ModelKeys.Bluetooth.prefix + "service_list",
GM_CONFIG.ModelKeys.Status = {},
GM_CONFIG.ModelKeys.Status.prefix = "Status_",
GM_CONFIG.ModelKeys.Status.Proximity = GM_CONFIG.ModelKeys.Status.prefix + "proximity",
GM_CONFIG.ModelKeys.Status.Ignition = GM_CONFIG.ModelKeys.Status.prefix + "ignition",
GM_CONFIG.ModelKeys.Favorites = "Favorites_",
GM_CONFIG.ModelKeys.Username = "username",
GM_CONFIG.ModelKeys.UserEmail = "useremail",
GM_CONFIG.ModelKeys.UserPin = "userpin",
GM_CONFIG.ModelKeys.Sync = {},
GM_CONFIG.ModelKeys.Sync.Periodicity = "Sync_Periodicity",
GM_CONFIG.LowSpeed = 40,
GM_CONFIG.ModelKeys.Driving = {},
GM_CONFIG.ModelKeys.Driving.prefix = "Vehicle_Drive_",
GM_CONFIG.ModelKeys.Driving.Status = GM_CONFIG.ModelKeys.Driving.prefix + "Status",
GM_CONFIG.ModelKeys.Driving.Destination = GM_CONFIG.ModelKeys.Driving.prefix + "Destination",
GM_CONFIG.ModelKeys.Driving.DirectionsLoaded = GM_CONFIG.ModelKeys.Driving.prefix + "DirectionsLoaded",
GM_CONFIG.ModelKeys.Driving.CurrentPosition = GM_CONFIG.ModelKeys.Driving.prefix + "CurrentPosition",
GM_CONFIG.ModelKeys.Driving.OdometerOffset = GM_CONFIG.ModelKeys.Driving.prefix + "odometer_offset",
GM_CONFIG.ModelKeys.GPS = {},
GM_CONFIG.ModelKeys.GPS.Timestamp = "GPS_Timestamp",
GM_CONFIG.ModelKeys.Time = {},
GM_CONFIG.ModelKeys.Time.prefix = "Time_",
GM_CONFIG.ModelKeys.Time.DoIncrement = GM_CONFIG.ModelKeys.Time.prefix + "Do_Increment",
GM_CONFIG.ModelKeys.Time.TimeMultiplier = GM_CONFIG.ModelKeys.Time.prefix + "Multiplier",
GM_CONFIG.ModelKeys.Communication = {},
GM_CONFIG.ModelKeys.Communication.prefix = "Communication_",
GM_CONFIG.ModelKeys.Communication.OutgoingPhone = GM_CONFIG.ModelKeys.Communication.prefix + "OutgoingPhone",
GM_CONFIG.ModelKeys.Communication.TextNum = GM_CONFIG.ModelKeys.Communication.prefix + "TextNum",
GM_CONFIG.ModelKeys.Communication.TextMessage = GM_CONFIG.ModelKeys.Communication.prefix + "TextMessage",
GM_CONFIG.ModelKeys.Communication.EmailTo = GM_CONFIG.ModelKeys.Communication.prefix + "EmailTo",
GM_CONFIG.ModelKeys.Communication.EmailFrom = GM_CONFIG.ModelKeys.Communication.prefix + "EmailFrom",
GM_CONFIG.ModelKeys.Communication.EmailBody = GM_CONFIG.ModelKeys.Communication.prefix + "EmailBody",
GM_CONFIG.ModelKeys.Communication.EmailSubject = GM_CONFIG.ModelKeys.Communication.prefix + "EmailSubject",
GM_CONFIG.ModelKeys.Communication.IAPAuth = "iap_auth",
GM_CONFIG.ModelKeys.Communication.BaseServerURL = "base_server_url",
GM_CONFIG.ModelKeys.Communication.PROTOCOL = "protocol",
GM_CONFIG.ModelKeys.POISearch = {},
GM_CONFIG.ModelKeys.POISearch.prefix = "POISearch_",
GM_CONFIG.ModelKeys.POISearch.ProviderInfo = GM_CONFIG.ModelKeys.POISearch.prefix + "ProviderInfo",
GM_CONFIG.ModelKeys.POISearch.POISearchSettings = GM_CONFIG.ModelKeys.POISearch.prefix + "POISearchSettings",
GM_CONFIG.ModelKeys.POISearch.POISearchResults = GM_CONFIG.ModelKeys.POISearch.prefix + "POISearchResults",
GM_CONFIG.ModelKeys.POISearch.ResultsAvailable = GM_CONFIG.ModelKeys.POISearch.prefix + "ResultsAvailable",
GM_CONFIG.ModelKeys.VehicleData = {},
GM_CONFIG.ModelKeys.VehicleData.prefix = "Vehicle_Data_",
GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry = GM_CONFIG.ModelKeys.VehicleData.prefix + "DTC_table_list",
GM_CONFIG.POISearch = {},
GM_CONFIG.POISearch.APP_WATCH = "POISearch_Watch",
GM_CONFIG.Communication = {},
GM_CONFIG.Communication.APP_WATCH_PREFIX = "appWatch-",
GM_CONFIG.Communication.SHUTDOWN_WATCH_PREFIX = "appShutdownWatch-",
GM_CONFIG.Communication.REQUEST_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "CONNECT"],
GM_CONFIG.Audio = {},
GM_CONFIG.Audio.INCREMENT = .1,
GM_CONFIG.Audio.EXCLUSIVE_AUDIO = "exclusiveAudio",
GM_CONFIG.Audio.MIXED_AUDIO = "mixedAudio",
GM_CONFIG.VehicleConfiguration = {
    screenSize: 8,
    navEngine: "Embedded",
    textMessaging: !0,
    email: !0,
    webGL: !0,
    proximity: !0,
    phonebook: !1,
    input: "I_Touch",
    SWC: !1,
    video: "Full-Screen",
    DUN: !0,
    PAN: !0,
    WIFI: !0,
    apiVersion: "2.0",
    theme: "gmc",
    language: "0",
    region: "North America",
    leftHandDrive: !1,
    popUpTimer: -1,
    overlays: {
        appTray: "On",
        favorites: "Off",
        interactionSelector: "Off",
        arrowSize: 51,
        top: 90,
        bottom: 0
    },
    buttonsAvailable: {
        SWC_SELECT: !0,
        SWC_UP: !0,
        SWC_DOWN: !0,
        SWC_VOL_UP: !0,
        SWC_VOL_DOWN: !0,
        BUTTON_BACK: !0,
        BUTTON_INFO: !0,
        RC_CW: !0,
        RC_CCW: !0,
        RC_SELECT: !0
    }
},
GM_CONFIG.Languages = {
    0: {
        code: "en_US",
        display: "English"
    },
    1: {
        code: "de_DE",
        display: "German"
    },
    2: {
        code: "it_IT",
        display: "Italian"
    },
    3: {
        code: "sv_SE",
        display: "Swedish"
    },
    4: {
        code: "fr_FR",
        display: "French"
    },
    5: {
        code: "es_ES",
        display: "Spanish"
    },
    6: {
        code: "nl_NL",
        display: "Dutch"
    },
    7: {
        code: "pt_PT",
        display: "Portugese"
    },
    8: {
        code: "no_NO",
        display: "Norwegian"
    },
    9: {
        code: "",
        display: "Finnish"
    },
    10: {
        code: "da_DK",
        display: "Danish"
    },
    11: {
        code: "el_GR",
        display: "Greek"
    },
    12: {
        code: "jp_JP",
        display: "Japanese"
    },
    13: {
        code: "ar_WW",
        display: "Arabic"
    },
    14: {
        code: "zh_CN",
        display: "Standard Chinese"
    },
    15: {
        code: "pl_PL",
        display: "Polish"
    },
    16: {
        code: "tr_TR",
        display: "Turkish"
    },
    17: {
        code: "ko_KR",
        display: "Korean"
    },
    18: {
        code: "zh_HK",
        display: "Traditional Chinese"
    },
    19: {
        code: "en_UK",
        display: "UK English"
    },
    20: {
        code: "",
        display: "Hungarian"
    },
    21: {
        code: "",
        display: "Czech"
    },
    22: {
        code: "sk_SK",
        display: "Slovak"
    },
    23: {
        code: "ru_RU",
        display: "Russian"
    },
    24: {
        code: "pt_BR",
        display: "Brazilian Portuguese"
    },
    25: {
        code: "th_TH",
        display: "Thai"
    },
    26: {
        code: "",
        display: "Bulgarian"
    },
    27: {
        code: "",
        display: "Romanian"
    },
    28: {
        code: "",
        display: "Slovenian"
    },
    29: {
        code: "",
        display: "Croatian"
    },
    30: {
        code: "",
        display: "Ukrainian"
    }
},
GM_CONFIG.ScreenSize = {},
GM_CONFIG.ScreenSize.LARGE = 8,
GM_CONFIG.ScreenSize.SMALL = 4.2,
GM_CONFIG.Shutdown = {
    USER: 0,
    BUS: 1,
    SYSTEM: 2,
    TimeLimit: 3e3
},
GM_CONFIG.AppConfig = {},
GM_CONFIG.AppConfig.Rendering = {
    BACKGROUND: 0,
    FULL_SCREEN: 1,
    NORMAL: 2
},
GM_CONFIG.SYSTEM_APP_ID = 3,
GM_CONFIG.Events = {
    NATIVE_APP: "NATIVE_APP",
    APP_CLOSED: "APP_CLOSED",
    SEARCH_RESULTS: "SEARCH_RESULTS",
    DEVICE_CONNECTION: "DEVICE_CONNECTION",
    SEND_SPP_DATA: "SEND_SPP_DATA",
    SEND_TO_PHONE: "SEND_TO_PHONE",
    SEND_FROM_PHONE: "SEND_FROM_PHONE",
    PLAY_VIDEO: "PLAY_VIDEO",
    PAUSE_VIDEO: "PAUSE_VIDEO",
    STOP_VIDEO: "STOP_VIDEO",
    SEEK_VIDEO: "SEEK_VIDEO",
    PLAY_AUDIO: "PLAY_AUDIO",
    PAUSE_AUDIO: "PAUSE_AUDIO",
    STOP_AUDIO: "STOP_AUDIO",
    SEEK_AUDIO: "SEEK_AUDIO",
    START_TTS: "START_TTS",
    STOP_TTS: "STOP_TTS",
    VOLUME_UP_CLICKED: "VOLUME_UP_CLICKED",
    VOLUME_DOWN_CLICKED: "VOLUME_DOWN_CLICKED",
    UPDATE_VOLUME: "UPDATE_VOLUME",
    CREATE_APP: "CREATE_APP",
    FOCUS_APP: "FOCUS_APP",
    CLOSE_APP: "CLOSE_APP",
    LAUNCH_APP: "LAUNCH_APP",
    DELETE_APP: "DELETE_APP",
    APP_INFO_CHANGE: "APP_INFO_CHANGE",
    APP_STATE_CHANGE: "APP_STATE_CHANGE",
    CHANGE_APP_NAME: "CHANGE_APP_NAME",
    SEND_SDARS: "SEND_SDARS"
},
GM_CONFIG.FailureCodes = {
    UNKNOWN: 0,
    INVALID_INPUT_PARAMS: 1,
    COMMUNICATION_FAILURE: 2,
    APP_RUNNING: 11,
    APP_NOT_FOUND: 12,
    FILE_IO_SUCCESS: 11,
    FILE_IO_NOT_FOUND: 12,
    FILE_IO_ACCESS_DENIED: 13,
    FILE_IO_LIMIT_EXCEEDED: 15,
    NO_BT_CONNECTION: 1,
    NO_SPP_BINDING: 2
},
GM_CONFIG.FocusStates = {
    BACKGROUND: 0,
    FOREGROUND: 1
},
GM_CONFIG.AppStates = {
    AS_NOT_ACTIVE: 0,
    AS_FOREGROUND: 1,
    AS_FOREGROUND_LOCKED: 2,
    AS_BACKGROUND: 3,
    AS_BACKGROUND_LOCKED: 4,
    AS_DISABLED: 5
},
GM_CONFIG.sliderSteps = 1,
GM_CONFIG.sliderLength = 100,
GM_CONFIG.KPAG_IN_PSI = .1450378911491,
GM_CONFIG.KM_IN_MILES = .621371192,
GM_CONFIG.CM_IN_FEET = .032808399,
GM_CONFIG.LOWSPEED_THRESHOLD = 8,
GM_CONFIG.DRIVE_STATES = {
    PARK: "Park",
    REVERSE: "Reverse",
    NEUTRAL: "Neutral",
    LOWSPEED: "LowSpeed",
    HIGHSPEED: "HighSpeed",
    DRIVE: "Drive"
},
GM_CONFIG.SPEEDS = {
    PARK: 0,
    LOW_SPEED: 1,
    HIGH_SPEED: 2
},
GM_CONFIG.APP_STATUSES = {
    ACTIVE_RUNNING: 0,
    ACTIVE_UNAVAILABLE: 1,
    PENDING: 2,
    DELETED: 3,
    ACTIVE_AVAILABLE: 4
},
GM_CONFIG.FILTER = {
    ANY: 2
},
GM_CONFIG.SyncPeriods = {
    MANUALLY: 0,
    ON_CONNECTION: 1,
    DAILY: 2,
    WEEKLY: 3,
    CATALOG: 4
},
GM_CONFIG.MessageTypes = {
    PHONE: 0,
    APP: 1
},
GM_CONFIG.VehicleData = {
    Vehicle_Stability_LS: {
        yaw_rate: {
            description: "Vehicle Dynamics Yaw Rate",
            slider: {
                from: -128,
                to: 127.9375,
                decimals: 2,
                units: "deg/sec"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "yaw_rate",
                defaultValue: 0
            }
        },
        long_accel: {
            description: "Vehicle Stability Enhancement Longitudinal Acceleration",
            slider: {
                from: -15.36,
                to: 15.33,
                decimals: 2,
                units: "m/s^2"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "long_accel",
                defaultValue: 0
            }
        },
        lat_accel: {
            description: "Vehicle Stability Enhancement Lateral Acceleration",
            slider: {
                from: -32,
                to: 31.984375,
                decimals: 2,
                units: "m/s^2"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "lat_accel",
                defaultValue: 0
            }
        },
        wheel_angle: {
            description: "Steering Wheel Angle",
            slider: {
                from: -2048,
                to: 2047.9375,
                decimals: 2,
                units: "deg"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "wheel_angle",
                defaultValue: 0
            }
        }
    },
    Engine_Information_1_LS: {
        shift_mode_status: {
            description: "Transmission Shift Mode Status",
            select: {
                0: "No Override Mode",
                1: "Performance Mode",
                2: "Lift-Foot Cornering Mode",
                3: "Automatic Grade Braking Mode"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "shift_mode_status",
                defaultValue: 0
            }
        },
        engine_speed: {
            description: "Engine Speed",
            slider: {
                from: 0,
                to: 16383.75,
                decimals: 2,
                units: "rpm"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "engine_speed",
                defaultValue: 0
            }
        },
        throttle_position: {
            description: "Throttle Position",
            slider: {
                from: 0,
                to: 100.000035,
                decimals: 2,
                units: "%"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "throttle_position",
                defaultValue: 0
            }
        },
        accelerator_position: {
            description: "Accelerator Actual Position",
            slider: {
                from: 0,
                to: 100.000035,
                decimals: 2,
                units: "%"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "accelerator_position",
                defaultValue: 0
            }
        },
        shift_lever_position: {
            description: "Transmission Shift Lever Position",
            select: {
                0: "Between Ranges",
                1: "Park Range",
                2: "Reverse Range",
                3: "Neutral Range",
                4: "Forward Range A",
                5: "Forward Range B",
                6: "Forward Range C",
                7: "Forward Range D",
                8: "Forward Range E",
                9: "Forward Range F",
                A: "Forward Range G",
                B: "Forward Range H",
                F: "Lever Position Unknown"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "shift_lever_position",
                defaultValue: 1
            }
        }
    },
    Fuel: {
        fuel_level: {
            description: "Fuel Level",
            slider: {
                from: 0,
                to: 100,
                decimals: 2,
                units: "%"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "fuel_level",
                defaultValue: 0
            }
        }
    },
    USDT_Resp_From_ACCM_LS: {
        engine_oil_pressure: {
            description: "Engine Oil Pressure",
            slider: {
                from: 0,
                to: 1020,
                decimals: 2
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "engine_oil_pressure",
                defaultValue: 0
            }
        }
    },
    DTC_Triggered: {
        transmission_oil_temp: {
            description: "Transmission Oil Temperature",
            slider: {
                from: -40,
                to: 215,
                decimals: 1,
                units: "deg C"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "transmission_oil_temp",
                defaultValue: 30
            }
        },
        engine_oil_temp: {
            description: "Engine Oil Temperature",
            slider: {
                from: -40,
                to: 215,
                decimals: 1,
                units: "deg C"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "engine_oil_temp",
                defaultValue: 30
            }
        },
        engine_coolant_temp: {
            description: "Engine Coolant Temperature",
            slider: {
                from: -40,
                to: 215,
                decimals: 1,
                units: "deg C"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "engine_coolant_temp",
                defaultValue: 30
            }
        }
    },
    Tire_Pressure_Sensors_LS: {
        tire_left_front_pressure: {
            description: "Tire Left Front Pressure",
            slider: {
                from: 0,
                to: 1020,
                decimals: 1,
                units: "kPaG"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "tire_left_front_pressure",
                defaultValue: 200
            }
        },
        tire_left_rear_pressure: {
            description: "Tire Left Rear Pressure",
            slider: {
                from: 0,
                to: 1020,
                decimals: 1,
                units: "kPaG"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "tire_left_rear_pressure",
                defaultValue: 200
            }
        },
        tire_right_front_pressure: {
            description: "Tire Right Front Pressure",
            slider: {
                from: 0,
                to: 1020,
                decimals: 1,
                units: "kPaG"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "tire_right_front_pressure",
                defaultValue: 200
            }
        },
        tire_right_rear_pressure: {
            description: "Tire Right Rear Pressure",
            slider: {
                from: 0,
                to: 1020,
                decimals: 1,
                units: "kPaG"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "tire_right_rear_pressure",
                defaultValue: 200
            }
        }
    },
    Vehicle_Odo_LS: {
        odometer: {
            description: "Vehicle Odometer",
            slider: {
                from: 0,
                to: 67108863.984375,
                decimals: 1,
                units: "km"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "odometer",
                defaultValue: 0
            }
        },
        disable: {
            "class": "gps",
            message: "GPS settings disabled while driving."
        }
    },
    GPS_Geographical_Position_LS: {
        gps_lat: {
            description: "Positioning System Latitude",
            slider: {
                from: -536870912,
                to: 536870911,
                decimals: 0,
                units: "ms arc"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "gps_lat",
                defaultValue: null
            }
        },
        gps_long: {
            description: "Position System Longitude",
            slider: {
                from: -1073741824,
                to: 1073741823,
                decimals: 0,
                units: "ms arc"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "gps_long",
                defaultValue: null
            }
        },
        disable: {
            "class": "gps",
            message: "GPS settings disabled while driving."
        }
    },
    GPS_Elevation_and_Heading_LS: {
        gps_heading: {
            description: "Positioning System Heading",
            slider: {
                from: 0,
                to: 409.5,
                decimals: 1,
                units: "deg"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "gps_heading",
                defaultValue: 0
            }
        },
        gps_elevation: {
            description: "Positioning System Elevation",
            slider: {
                from: -1e5,
                to: 1997151,
                decimals: 0,
                units: "cm"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "gps_elevation",
                defaultValue: 0
            }
        },
        disable: {
            "class": "gps",
            message: "GPS settings disabled while driving."
        }
    },
    Date_and_Time_LS: {
        year: {
            description: "Calendar Year",
            slider: {
                from: 2e3,
                to: 2255,
                decimals: 0,
                steps: 256
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "year",
                defaultValue: 2010
            }
        },
        month: {
            description: "Calendar Month",
            select: {
                0: "Unknown",
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                A: "October",
                B: "November",
                C: "December"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "month",
                defaultValue: "C"
            }
        },
        day: {
            description: "Calendar Day",
            slider: {
                from: 1,
                to: 31,
                decimals: 0,
                steps: 31
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "day",
                defaultValue: 31
            }
        },
        hours: {
            description: "Hours",
            slider: {
                from: 0,
                to: 23,
                decimals: 0,
                steps: 24
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "hours",
                defaultValue: 15
            }
        },
        minutes: {
            description: "Minutes",
            slider: {
                from: 0,
                to: 59,
                decimals: 0,
                steps: 64
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "minutes",
                defaultValue: 0
            }
        },
        seconds: {
            description: "Seconds",
            slider: {
                from: 0,
                to: 59,
                decimals: 0,
                steps: 60
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "seconds",
                defaultValue: 0
            }
        }
    },
    Power_Conv_Top_Info_LS: {
        folding_top_state: {
            description: "Folding Top State",
            select: {
                0: "Fully Opened",
                1: "Fully Closed",
                2: "Opening",
                3: "Closing",
                4: "Not Secure and Not Moving"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "folding_top_state",
                defaultValue: 1
            }
        }
    },
    Outside_Air_Temperature_LS: {
        outside_air_temp: {
            description: "Outside Air Temperature Corrected Value",
            slider: {
                from: -40,
                to: 120,
                decimals: 1,
                units: "deg F"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "outside_air_temp",
                defaultValue: 68
            }
        }
    },
    Vehicle_Speed_Information: {
        average_speed: {
            description: "Vehicle Speed Average Driven",
            slider: {
                from: 0,
                to: 511.984375,
                decimals: 1,
                units: "km/h"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "average_speed",
                defaultValue: 0
            }
        },
        disable: {
            "class": "gps",
            message: "GPS settings disabled while driving."
        }
    },
    VIN_Digits_2_to_9: {
        vin_2_9: {
            description: "Vehicle Identification Number Digits 2-9",
            text: {
                attributes: {
                    maxlength: "8"
                }
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "vin_2_9",
                defaultValue: "12345678",
                regex: /\w{8}/,
                message: "You must enter exactly 8 digits."
            }
        }
    },
    VIN_Digits_10_to_17: {
        vin_10_17: {
            description: "Vehicle Identification Number Digits 10-17",
            text: {
                attributes: {
                    maxlength: "9"
                }
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "vin_10_17",
                defaultValue: "90123456",
                regex: /\w{8}/,
                message: "You must enter exactly 8 digits."
            }
        }
    },
    Lighting_Status_LS: {
        light_level: {
            description: "Outside Ambient Light Level Status",
            select: {
                0: "Unknown",
                1: "Night",
                2: "Day"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "light_level",
                defaultValue: 2
            }
        }
    },
    DTC_Table_Entry: {
        tableID: {
            description: "Framework assigned number to uniquely identify table entry",
            text: {
                attributes: {
                    maxlength: "8"
                }
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "tableID",
                defaultValue: 0
            }
        },
        triggered: {
            description: "boolean to see if the DTC triggered?",
            select: {
                0: "true",
                1: "false"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "triggered",
                defaultValue: "false"
            }
        },
        source: {
            description: "The module source of the DTC",
            select: {
                0: "01-BCM",
                1: "02-VES",
                2: "03-EPS",
                3: "04-EBCM2",
                4: "05-HPCC",
                5: "06-OBCM",
                6: "07-DCDC",
                7: "08-ALC",
                8: "09-SCRPM",
                9: "10-APPS",
                10: "11-PTO",
                11: "12-GDL",
                12: "13-AHL/AFL1",
                13: "14-SAS",
                14: "15-EOCM",
                15: "16-FCM",
                16: "17-PFAM",
                17: "18-FCP",
                18: "19-OnStar VCP",
                19: "20-SADS",
                20: "21-RDCM",
                21: "22-MCP R",
                22: "23-PTAM",
                23: "24-AVM",
                24: "25-FDCM",
                25: "26-HMIM",
                26: "27-AMP",
                27: "28-EPB",
                28: "29-AFS",
                29: "30-TCCM",
                30: "31-MCP",
                31: "32-MCP A",
                32: "33-MCP B",
                33: "34-MCP C",
                34: "35-ICCM2",
                35: "36-ACC",
                36: "37-ACCM",
                37: "38-ESTM",
                38: "39-ARS",
                39: "40-SIU",
                40: "41-VCM",
                41: "42-VLBS",
                42: "43-VES",
                43: "44-EPS",
                44: "45-EBCM2",
                45: "46-HPCC",
                46: "47-OBCM",
                47: "48-DCDC",
                48: "49-ALC",
                49: "50-SCRPM",
                50: "51-APPS",
                51: "52-PTO",
                52: "53-GDL",
                53: "54-AHL/AFL1",
                54: "55-SAS",
                55: "56-PFAM",
                56: "57-SADS",
                57: "58-RDCM",
                58: "59-MCP R",
                59: "60-PTAM",
                60: "61-AVM",
                61: "62-FDCM",
                62: "63-HMIM",
                63: "64-EPB",
                64: "65-AFS",
                65: "66-TCCM",
                66: "67-MCP",
                67: "68-MCP A",
                68: "69-MCP B",
                69: "70-MCP C",
                70: "71-ICCM2",
                71: "72-ACC",
                72: "73-ESTM",
                73: "74-ARS",
                74: "75-SIU",
                75: "76-VCM",
                76: "77-VLBS"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "source",
                defaultValue: "01-BCM"
            }
        },
        number: {
            description: "The DTC number",
            select: {
                0: "001",
                1: "002",
                2: "003",
                3: "004",
                4: "005"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "number",
                defaultValue: "001"
            }
        },
        type: {
            description: "The DTC type",
            select: {
                0: "DTC-Type1",
                1: "DTC-Type2",
                2: "DTC-Type3",
                3: "DTC-Type4"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "type",
                defaultValue: "DTC-Type1"
            }
        },
        history: {
            description: "Was the DTC set previously since last clearing of it",
            select: {
                0: "true",
                1: "false"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "history",
                defaultValue: "false"
            }
        },
        failSinceCleared: {
            description: "Has the DTC failed since being cleared",
            select: {
                0: "true",
                1: "false"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "failSinceCleared",
                defaultValue: "false"
            }
        },
        notPassedSinceCleared: {
            description: "Has the DTC not passed since being cleared",
            select: {
                0: "true",
                1: "false"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "notPassedSinceCleared",
                defaultValue: "false"
            }
        },
        faultType: {
            description: "The type of fault for this DTC",
            select: {
                0: "00",
                1: "01",
                2: "02",
                3: "03",
                4: "04",
                5: "05",
                6: "06",
                7: "07",
                8: "08",
                9: "09",
                10: "0A",
                11: "0B",
                12: "0C",
                13: "0D",
                14: "0E",
                15: "0F",
                16: "11",
                17: "12",
                18: "13",
                19: "14",
                20: "15",
                21: "16",
                22: "17",
                23: "18",
                24: "19",
                25: "1A",
                26: "1B",
                27: "1F",
                28: "21",
                29: "22",
                30: "23",
                31: "24",
                32: "25",
                33: "26",
                34: "27",
                35: "28",
                36: "29",
                37: "2A",
                38: "2B",
                39: "31",
                40: "32",
                41: "33",
                42: "34",
                43: "35",
                44: "36",
                45: "37",
                46: "38",
                47: "39",
                48: "3A",
                49: "3B",
                50: "3C",
                51: "42",
                52: "43",
                53: "44",
                54: "45",
                55: "46",
                56: "47",
                57: "48",
                58: "49",
                59: "4A",
                60: "4B",
                61: "4C",
                62: "4D",
                63: "53",
                64: "54",
                65: "55",
                66: "56",
                67: "57",
                68: "58",
                69: "59",
                70: "5A",
                71: "61",
                72: "62",
                73: "63",
                74: "64",
                75: "65",
                76: "66",
                77: "67",
                78: "71",
                79: "72",
                80: "73",
                81: "74",
                82: "75",
                83: "76",
                84: "7F"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "faultType",
                defaultValue: "00"
            }
        },
        status: {
            description: "status: Is DTC set",
            select: {
                0: "true",
                1: "false"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "status",
                defaultValue: "true"
            }
        },
        lastFaultDate: {
            description: "This filters for any fault At or after the date specified",
            text: {
                attributes: {
                    maxlength: "10"
                },
                help: "(e.g:mm/dd/yyyy)"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "lastFaultDate"
            }
        },
        previousFaultDate: {
            description: "This filters for any fault At or after the date specified",
            text: {
                attributes: {
                    maxlength: "10"
                },
                help: "(e.g:mm/dd/yyyy)"
            },
            model: {
                key: GM_CONFIG.ModelKeys.VehicleData + "previousFaultDate"
            }
        }
    }
},
GM_CONFIG.DefaultDeviceAddress = "00:11:22:AA:BB:CC",
GM_CONFIG.DefaultUsername = "DefaultUser",
GM_CONFIG.DefaultAuthToken = "m5g9i2s",
GM_CONFIG.DefaultTokenExpiration = new Date(3e3, 1, 1),
GM_CONFIG.DefaultTokenActive = !0,
GM_CONFIG.NETWORK_MANAGER = {
    Device_Types: {
        DT_Bluetooth: 0,
        DT_WiFi: 1,
        DT_Embedded: 2
    },
    Connection_Types: {
        SPP: 0,
        DUN: 1,
        PAN: 2,
        WIFI: 3,
        USB: 4,
        TELEMATICS: 5
    },
    Connection_Statuses: {
        NOT_AVAILABLE: 0,
        DISABLED: 1,
        ENABLED_INACTIVE: 2,
        ENABLED_ACTIVE: 3
    }
},
GM_CONFIG.NETWORK_MANAGER.User_Device_List = [{
    number: 0,
    deviceAddress: GM_CONFIG.DefaultDeviceAddress,
    username: GM_CONFIG.DefaultUsername,
    authToken: GM_CONFIG.DefaultAuthToken,
    expiration: GM_CONFIG.DefaultTokenExpiration,
    active: GM_CONFIG.DefaultTokenActive
},
{
    number: 1,
    deviceAddress: "11:22:33:44:55:66",
    username: "Bob",
    authToken: "g8ro9ss",
    expiration: GM_CONFIG.DefaultTokenExpiration,
    active: !0
}],
GM_CONFIG.NETWORK_MANAGER.Auth_Tokens = {
    "00:11:22:AA:BB:CC": [{
        authToken: GM_CONFIG.DefaultAuthToken,
        username: GM_CONFIG.DefaultUsername,
        expiration: GM_CONFIG.DefaultTokenExpiration,
        active: !0
    }],
    "11:22:33:44:55:66": [{
        authToken: "f6gs8r",
        username: GM_CONFIG.DefaultUsername,
        expiration: GM_CONFIG.DefaultTokenExpiration,
        active: !0
    },
    {
        authToken: "g8ro9ss",
        username: "Bob",
        expiration: GM_CONFIG.DefaultTokenExpiration,
        active: !1
    }],
    "AA:BB:CC:DD:EE:FF": [{
        authToken: "l9jd4h3",
        username: GM_CONFIG.DefaultUsername,
        expiration: GM_CONFIG.DefaultTokenExpiration,
        active: !0
    }]
},
GM_CONFIG.NETWORK_MANAGER.Default_Device_List = [{
    friendlyName: "Bluetooth Connection",
    deviceAddress: GM_CONFIG.DefaultDeviceAddress,
    outgoingSource: !0,
    deviceType: GM_CONFIG.NETWORK_MANAGER.Device_Types.DT_Bluetooth,
    connectionType: GM_CONFIG.NETWORK_MANAGER.Connection_Types.DUN,
    connectionStatus: GM_CONFIG.NETWORK_MANAGER.Connection_Statuses.ENABLED_ACTIVE,
    phoneNumber: "5555555555",
    id: 0
}],
GM_CONFIG.VehicleData.Default_Table_List = [{
    tableID: 0,
    triggered: !0,
    source: "DUMMY1",
    number: 0,
    type: 0,
    history: !1,
    failSinceCleared: !1,
    notPassedSinceCleared: !1,
    faultType: 0,
    status: 0
}],
GM_CONFIG.NETWORK_MANAGER.Device_Schema = {
    id: {
        description: "ID",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "id",
            defaultValue: "ID"
        }
    },
    friendlyName: {
        description: "Friendly name",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "friendly_name",
            defaultValue: "Friendly name"
        }
    },
    deviceAddress: {
        description: "Device address",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "device_address",
            defaultValue: ""
        }
    },
    outgoingSource: {
        description: "Outgoing source",
        select: [!0, !1],
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "outgoing_source",
            defaultValue: "true"
        }
    },
    deviceType: {
        description: "Device type",
        select: [GM_CONFIG.NETWORK_MANAGER.Device_Types.DT_Bluetooth, GM_CONFIG.NETWORK_MANAGER.Device_Types.DT_WiFi, GM_CONFIG.NETWORK_MANAGER.Device_Types.DT_Embedded],
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "device_type",
            defaultValue: 0
        }
    },
    connectionType: {
        description: "Connection type",
        select: [GM_CONFIG.NETWORK_MANAGER.Connection_Types.DUN, GM_CONFIG.NETWORK_MANAGER.Connection_Types.PAN, GM_CONFIG.NETWORK_MANAGER.Connection_Types.SPP, GM_CONFIG.NETWORK_MANAGER.Connection_Types.WIFI, GM_CONFIG.NETWORK_MANAGER.Connection_Types.TELEMATICS],
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "connection_type",
            defaultValue: 0
        }
    },
    connectionStatus: {
        description: "Connection status",
        select: [GM_CONFIG.NETWORK_MANAGER.Connection_Statuses.NOT_AVAILABLE, GM_CONFIG.NETWORK_MANAGER.Connection_Statuses.DISABLED, GM_CONFIG.NETWORK_MANAGER.Connection_Statuses.ENABLED_INACTIVE, GM_CONFIG.NETWORK_MANAGER.Connection_Statuses.ENABLED_ACTIVE],
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "connection_status",
            defaultValue: 0
        }
    },
    phoneNumber: {
        description: "Phone number",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.NetworkData + "phone_number",
            defaultValue: 0
        }
    }
},
GM_CONFIG.NETWORK_MANAGER.Connection_Priority = {
    model: {
        key: GM_CONFIG.ModelKeys.Network.NetworkPriority,
        defaultValue: "WIFI,TELEMATICS,DUN,SPP,USB"
    }
},
GM_CONFIG.DefaultBTService = "AT&T",
GM_CONFIG.BT_SERVICES = {
    WATCH_PREFIX: "BT_SERVICES_WATCH_"
},
GM_CONFIG.BT_SERVICES.Default_Service_List = [{
    deviceHandle: 99999,
    UUID: "a1b2c3d4e5",
    serviceNumber: 585,
    serviceName: "iPhone Bluetooth"
}],
GM_CONFIG.BT_SERVICES.Schema = {
    UUID: {
        description: "Service UUID",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.BTServicesData + "uuid",
            defaultValue: "a1"
        }
    },
    serviceNumber: {
        description: "Service Number",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.BTServicesData + "service_number",
            defaultValue: 0
        }
    },
    serviceName: {
        description: "Service Name",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.BTServicesData + "service_name",
            defaultValue: "BT Service X"
        }
    },
    deviceHandle: {
        description: "Device Handle",
        text: {
            attributes: {}
        },
        model: {
            key: GM_CONFIG.ModelKeys.BTServicesData + "device_handle",
            defaultValue: 1e4
        }
    }
},
GM_CONFIG.Navigation = {},
GM_CONFIG.Navigation.Maneuvers = [{
    value: 0,
    name: null,
    description: null
},
{
    value: 1,
    name: "ME_NO_MANEUVER",
    description: "No Maneuver",
    match: null
},
{
    value: 2,
    name: "ME_CONTINUE_STRAIGHT",
    description: "Continue Straight",
    match: /(continue|head)/gi
},
{
    value: 3,
    name: "ME_LEFT_TURN",
    description: "Left turn",
    match: /(turn|take).*left/gi
},
{
    value: 4,
    name: "ME_RIGHT_TURN",
    description: "Right Turn",
    match: /(turn|take).*right/gi
},
{
    value: 5,
    name: "ME_SHARP_LEFT_TURN",
    description: "Sharp Left Turn"
},
{
    value: 6,
    name: "ME_SHARP_RIGHT_TURN",
    description: "Sharp Right Turn"
},
{
    value: 7,
    name: "ME_BEAR_LEFT",
    description: "Bear Left",
    match: /(keep|slight).*left/gi
},
{
    value: 8,
    name: "ME_BEAR_RIGHT",
    description: "Bear Right",
    match: /(keep|slight).*right/gi
},
{
    value: 9,
    name: "ME_MERGE_LEFT",
    description: "Merge Left",
    match: /merge/gi
},
{
    value: 10,
    name: "ME_MERGE_RIGHT",
    description: "Merge Right",
    match: /take.*ramp/gi
},
{
    value: 11,
    name: "ME_EXIT_LEFT",
    description: "Exit left"
},
{
    value: 12,
    name: "ME_EXIT_RIGHT",
    description: "Exit Right",
    match: /take.*exit/gi
},
{
    value: 13,
    name: "ME_U_TURN_LEFT",
    description: "U Turn Left"
},
{
    value: 14,
    name: "ME_U_TURN_RIGHT",
    description: "U Turn Right"
},
{
    value: 15,
    name: "ME_DESTINATION_AHEAD",
    description: "Destination Ahead"
},
{
    value: 16,
    name: "ME_AT_DESTINATION",
    description: "At Destination"
}],
GM_CONFIG.RESTSERVICE_BASE_URL = "http://sfp.oboservices.mobi",
GM_CONFIG.USER_LOGIN_PATH = "json/api/loginAccount?",
GM_CONFIG.addAppToLayout_path = "api/addApplicationToLayout?",
GM_CONFIG.getOfflineAppUrl_path = "api/offlineApplicationURL?",
define("emulator.config", 
function() {}),
BaseView.prototype.destroy = function() {
    self = this;
    var a = this.observers;
    for (var b in a) {
        for (var c in this.contexts) a[b].hdl && x$(this.contexts[c]).find(a[b].target).un(a[b].event, a[b].hdl);
        a[b].channel && a[b].channel.unsubscribe(a[b].modelGUID)
    }
    self.contexts = null,
    self.observers = null,
    self = null
},
BaseView.prototype.addObserver = function(a, b, c, d) {
    var e = [];
    for (var f in this.contexts) {
        var g = x$(this.contexts[f]);
        if (b == "now") return c({
            target: g.find(a),
            xContext: g
        },
        d),
        null;
        var h,
        i,
        j;
        typeof a == "string" || a.addEventListener ? (h = function(a) {
            c({
                event: a,
                xContext: g
            },
            d)
        },
        e.push(g.find(a).on(b, h))) : typeof a == "object" && (a.model !== undefined ? j = a.channel[b].subscribe(function() {
            c({
                value: a.model.get(a.key),
                xContext: g
            },
            d)
        }) : a.msgRef !== undefined && a.channel[b].subscribe(c({
            message: a.message,
            xContext: g
        },
        d)), i = a.channel[b], e.push(a)),
        this.observers.push({
            target: a,
            event: b,
            hdl: h,
            channel: i,
            modelGUID: j
        })
    }
    return e.length == 0 && console.log("There is no context set for this view (" + a + ")"),
    e
},
define("view/base-view", 
function() {});
var LawnchairAdaptorHelpers = {
    merge: function(a, b) {
        return b == undefined || b == null ? a: b
    },
    terseToVerboseCallback: function(callback) {
        return typeof arguments[0] == "string" ? 
        function(r, i) {
            eval(callback)
        }: callback
    },
    now: function() {
        return (new Date).getTime()
    },
    uuid: function(a, b) {
        var c = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
        d = [];
        b = b || c.length;
        if (a) for (var e = 0; e < a; e++) d[e] = c[0 | Math.random() * b];
        else {
            var f;
            d[8] = d[13] = d[18] = d[23] = "-",
            d[14] = "4";
            for (var e = 0; e < 36; e++) d[e] || (f = 0 | Math.random() * 16, d[e] = c[e == 19 ? f & 3 | 8: f])
        }
        return d.join("")
    },
    serialize: function(a) {
        var b = "";
        return b = JSON.stringify(a),
        b
    },
    deserialize: function(json) {
        return eval("(" + json + ")")
    }
};
define("lib/lawnchair/adaptors/LawnchairAdaptorHelpers", 
function() {});
var DOMStorageAdaptor = function(a) {
    for (var b in LawnchairAdaptorHelpers) this[b] = LawnchairAdaptorHelpers[b];
    this.init(a)
};
DOMStorageAdaptor.prototype = {
    init: function(a) {
        var b = this;
        this.storage = this.merge(window.localStorage, a.storage),
        this.table = this.merge("field", a.table),
        window.Storage || (this.storage = function() {
            var a = window.top.name ? b.deserialize(window.top.name) : {};
            return {
                setItem: function(c, d) {
                    a[c] = d + "",
                    window.top.name = b.serialize(a)
                },
                removeItem: function(c) {
                    delete a[c],
                    window.top.name = b.serialize(a)
                },
                getItem: function(b) {
                    return a[b] || null
                },
                clear: function() {
                    a = {},
                    window.top.name = ""
                }
            }
        } ())
    },
    save: function(a, b) {
        var c = this.table + "::" + (a.key || this.uuid());
        delete a.key,
        this.storage.setItem(c, this.serialize(a)),
        b && (a.key = c.split("::")[1], b(a))
    },
    get: function(a, b) {
        var c = this.deserialize(this.storage.getItem(this.table + "::" + a)),
        d = this.terseToVerboseCallback(b);
        c ? (c.key = a, b && d(c)) : b && d(null)
    },
    all: function(a) {
        var b = this.terseToVerboseCallback(a),
        c = [];
        for (var d = 0, e = this.storage.length; d < e; ++d) {
            var f = this.storage.key(d),
            g = f.split("::")[0],
            h = f.split("::").slice(1).join("::");
            if (g == this.table) {
                var i = this.deserialize(this.storage.getItem(f));
                i.key = h,
                c.push(i)
            }
        }
        b && b(c)
    },
    remove: function(a, b) {
        var c = this.table + "::" + (typeof a == "string" ? a: a.key);
        this.storage.removeItem(c),
        b && b()
    },
    nuke: function(a) {
        var b = this;
        this.all(function(c) {
            for (var d = 0, e = c.length; d < e; d++) b.remove(c[d]);
            a && a()
        })
    }
},
define("lib/lawnchair/adaptors/DOMStorageAdaptor", 
function() {});
var CookieAdaptor = function(a) {
    for (var b in LawnchairAdaptorHelpers) this[b] = LawnchairAdaptorHelpers[b];
    this.init(a)
};
CookieAdaptor.prototype = {
    init: function() {
        this.createCookie = function(a, b, c) {
            if (c) {
                var d = new Date;
                d.setTime(d.getTime() + c * 24 * 60 * 60 * 1e3);
                var e = "; expires=" + d.toGMTString()
            } else var e = "";
            document.cookie = a + "=" + b + e + "; path=/"
        }
    },
    get: function(a, b) {
        var c = function(a) {
            var b = a + "=",
            c = document.cookie.split(";"),
            d = c.length;
            for (var e = 0; e < d; e++) {
                var f = c[e];
                while (f.charAt(0) == " ") f = f.substring(1, f.length);
                if (f.indexOf(b) == 0) return f.substring(b.length, f.length)
            }
            return null
        },
        d = this.deserialize(c(a)) || null;
        d && (d.key = a),
        b && this.terseToVerboseCallback(b)(d)
    },
    save: function(a, b) {
        var c = a.key || this.uuid();
        delete a.key,
        this.createCookie(c, this.serialize(a), 365),
        a.key = c,
        b && this.terseToVerboseCallback(b)(a)
    },
    all: function(a) {
        var b = this.terseToVerboseCallback(a),
        c = document.cookie.split(";"),
        d = [],
        e,
        f,
        g,
        h;
        for (var i = 0, j = c.length; i < j; i++) e = c[i].split("="),
        f = e[0],
        g = e[1],
        h = this.deserialize(g),
        h && (h.key = f, d.push(h));
        b && b(d)
    },
    remove: function(a, b) {
        var c = typeof a == "string" ? a: a.key;
        this.createCookie(c, "", -1),
        b && this.terseToVerboseCallback(b)()
    },
    nuke: function(a) {
        var b = this;
        this.all(function(c) {
            for (var d = 0, e = c.length; d < e; d++) c[d].key && b.remove(c[d].key);
            a && (a = b.terseToVerboseCallback(a), a(c))
        })
    }
},
define("lib/lawnchair/adaptors/CookieAdaptor", 
function() {});
var Lawnchair = function(a) {
    this.init(a)
};
Lawnchair.prototype = {
    init: function(a) {
        var b = {
            webkit: window.WebkitSQLiteAdaptor,
            gears: window.GearsSQLiteAdaptor,
            dom: window.DOMStorageAdaptor,
            cookie: window.CookieAdaptor,
            air: window.AIRSQLiteAdaptor,
            userdata: window.UserDataAdaptor,
            "air-async": window.AIRSQLiteAsyncAdaptor,
            blackberry: window.BlackBerryPersistentStorageAdaptor,
            couch: window.CouchAdaptor
        };
        this.adaptor = a.adaptor ? new b[a.adaptor](a) : new DOMStorageAdaptor(a);
        if (!JSON || !JSON.stringify) throw "Native JSON functions unavailable - please include http://www.json.org/json2.js or run on a decent browser :P"
    },
    save: function(a, b) {
        this.adaptor.save(a, b)
    },
    get: function(a, b) {
        this.adaptor.get(a, b)
    },
    exists: function(a) {
        this.adaptor.exists(a)
    },
    all: function(a) {
        this.adaptor.all(a)
    },
    remove: function(a, b) {
        this.adaptor.remove(a, b)
    },
    nuke: function(a) {
        return this.adaptor.nuke(a),
        this
    },
    paged: function(a, b) {
        this.adaptor.paged(a, b)
    },
    find: function(condition, callback) {
        var is = typeof condition == "string" ? 
        function(r) {
            return eval(condition)
        }: condition,
        cb = this.adaptor.terseToVerboseCallback(callback);
        this.each(function(a, b) {
            is(a) && cb(a, b)
        })
    },
    each: function(a) {
        var b = this.adaptor.terseToVerboseCallback(a);
        this.all(function(a) {
            var c = a.length;
            for (var d = 0; d < c; d++) b(a[d], d)
        })
    }
},
define("lib/lawnchair/Lawnchair", 
function() {}),
function() {
    function removex(a, b, c) {
        var d = a.slice((c || b) + 1 || a.length);
        return a.length = b < 0 ? a.length + b: b,
        a.push.apply(a, d)
    }
    function getTag(a) {
        return a.firstChild === null ? {
            UL: "LI",
            DL: "DT",
            TR: "TD"
        } [a.tagName] || a.tagName: a.firstChild.tagName
    }
    function wrapHelper(a, b) {
        return typeof a == string ? wrap(a, getTag(b)) : a
    }
    function wrap(a, b) {
        var c = {},
        d = /^<([A-Z][A-Z0-9]*)([^>]*)>([\s\S]*)<\/\1>/i,
        e,
        f,
        g,
        h = 0,
        i,
        j,
        k,
        l;
        if (d.test(a)) {
            l = d.exec(a),
            b = l[1];
            if (l[2] !== "") {
                k = l[2].split(/([A-Z]*\s*=\s*['|"][A-Z0-9:;#\s]*['|"])/i);
                for (; h < k.length; h++) i = k[h].replace(/^\s*|\s*$/g, ""),
                i !== "" && i !== " " && (j = i.split("="), c[j[0]] = j[1].replace(/(["']?)/g, ""))
            }
            a = l[3]
        }
        e = document.createElement(b);
        for (f in c) g = document.createAttribute(f),
        g.nodeValue = c[f],
        e.setAttributeNode(g);
        return e.innerHTML = a,
        e
    }
    function clean(a) {
        var b = /\S/;
        a.each(function(a) {
            var c = a,
            d = c.firstChild,
            e = -1,
            f;
            while (d) f = d.nextSibling,
            d.nodeType == 3 && !b.test(d.nodeValue) ? c.removeChild(d) : d.nodeIndex = ++e,
            d = f
        })
    }
    function _getEventID(a) {
        return a._xuiEventID ? a._xuiEventID: a._xuiEventID = ++_getEventID.id
    }
    function _getRespondersForEvent(a, b) {
        var c = cache[a] = cache[a] || {};
        return c[b] = c[b] || []
    }
    function _createResponder(a, b, c) {
        var d = _getEventID(a),
        e = _getRespondersForEvent(d, b),
        f = function(b) {
            c.call(a, b) === !1 && (b.preventDefault(), b.stopPropagation())
        };
        return f.guid = c.guid = c.guid || ++_getEventID.id,
        f.handler = c,
        e.push(f),
        f
    }
    function hasClass(a, b) {
        return getClassRegEx(b).test(a.className)
    }
    function trim(a) {
        return (a || "").replace(rtrim, "")
    }
    var undefined,
    xui,
    window = this,
    string = new String("string"),
    document = window.document,
    simpleExpr = /^#?([\w-]+)$/,
    idExpr = /^#/,
    tagExpr = /<([\w:]+)/,
    slice = function(a) {
        return [].slice.call(a, 0)
    };
    try {
        var a = slice(document.documentElement.childNodes)[0].nodeType
    } catch(e) {
        slice = function(a) {
            var b = [];
            for (var c = 0; a[c]; c++) b.push(a[c]);
            return b
        }
    }
    window.x$ = window.xui = xui = function(a, b) {
        return new xui.fn.find(a, b)
    },
    [].forEach || (Array.prototype.forEach = function(a) {
        var b = this.length || 0,
        c = 0,
        d = arguments[1];
        if (typeof a == "function") for (; c < b; c++) a.call(d, this[c], c, this)
    }),
    xui.fn = xui.prototype = {
        extend: function(a) {
            for (var b in a) xui.fn[b] = a[b]
        },
        find: function(a, b) {
            var c = [],
            d;
            if (!a) return this;
            if (b == undefined && this.length) c = this.each(function(b) {
                c = c.concat(slice(xui(a, b)))
            }).reduce(c);
            else {
                b = b || document;
                if (typeof a == string) simpleExpr.test(a) && b.getElementById && b.getElementsByTagName ? (c = idExpr.test(a) ? [b.getElementById(a.substr(1))] : b.getElementsByTagName(a), c[0] == null && (c = [])) : tagExpr.test(a) ? (d = document.createElement("i"), d.innerHTML = a, slice(d.childNodes).forEach(function(a) {
                    c.push(a)
                })) : window.Sizzle !== undefined ? c = Sizzle(a, b) : c = b.querySelectorAll(a),
                c = slice(c);
                else if (a instanceof Array) c = a;
                else if (a.toString() == "[object NodeList]") c = slice(a);
                else if (a.nodeName || a === window) c = [a]
            }
            return this.set(c)
        },
        set: function(a) {
            var b = xui();
            return b.cache = slice(this.length ? this: []),
            b.length = 0,
            [].push.apply(b, a),
            b
        },
        reduce: function(a, b) {
            var c = [],
            a = a || slice(this);
            return a.forEach(function(a) {
                c.indexOf(a, 0, b) < 0 && c.push(a)
            }),
            c
        },
        has: function(a) {
            var b = xui(a);
            return this.filter(function() {
                var a = this,
                c = null;
                return b.each(function(b) {
                    c = c || b == a
                }),
                c
            })
        },
        filter: function(a) {
            var b = [];
            return this.each(function(c, d) {
                a.call(c, d) && b.push(c)
            }).set(b)
        },
        not: function(a) {
            var b = slice(this);
            return this.filter(function(c) {
                var d;
                return xui(a).each(function(a) {
                    return d = b[c] != a
                }),
                d
            })
        },
        each: function(a) {
            for (var b = 0, c = this.length; b < c; ++b) if (a.call(this[b], this[b], b, this) === !1) break;
            return this
        }
    },
    xui.fn.find.prototype = xui.fn,
    xui.extend = xui.fn.extend,
    xui.extend({
        html: function(location, html) {
            clean(this);
            if (arguments.length == 0) return this[0].innerHTML;
            arguments.length == 1 && arguments[0] != "remove" && (html = location, location = "inner");
            if (html && html.each !== undefined) {
                var that = this;
                return html.each(function(a) {
                    that.html(location, a)
                }),
                this
            }
            return this.each(function(el) {
                var parent,
                list,
                len,
                i = 0;
                if (location == "inner") if (typeof html == string || typeof html == "number") {
                    el.innerHTML = html,
                    list = el.getElementsByTagName("SCRIPT"),
                    len = list.length;
                    for (; i < len; i++) eval(list[i].text)
                } else el.innerHTML = "",
                el.appendChild(html);
                else location == "outer" ? el.parentNode.replaceChild(wrapHelper(html, el), el) : location == "top" ? el.insertBefore(wrapHelper(html, el), el.firstChild) : location == "bottom" ? el.insertBefore(wrapHelper(html, el), null) : location == "remove" ? el.parentNode.removeChild(el) : location == "before" ? el.parentNode.insertBefore(wrapHelper(html, el.parentNode), el) : location == "after" && el.parentNode.insertBefore(wrapHelper(html, el.parentNode), el.nextSibling)
            })
        },
        attr: function(a, b) {
            if (arguments.length == 2) return this.each(function(c) {
                a != "checked" || b != "" && b != 0 && typeof b != "undefined" ? c.setAttribute(a, b) : c.removeAttribute(a)
            });
            var c = [];
            return this.each(function(b) {
                var d = b.getAttribute(a);
                d != null && c.push(d)
            }),
            c
        }
    }),
    "inner outer top bottom remove before after".split(" ").forEach(function(a) {
        xui.fn[a] = function(a) {
            return function(b) {
                return this.html(a, b)
            }
        } (a)
    }),
    xui.events = {};
    var cache = {};
    xui.extend({
        on: function(a, b, c, d) {
            return this.each(function(e) {
                if (xui.events[a]) {
                    var f = _getEventID(e),
                    g = _getRespondersForEvent(f, a);
                    d = d || {},
                    d.handler = function(b, c) {
                        xui.fn.fire.call(xui(this), a, c)
                    },
                    g.length || xui.events[a].call(e, d)
                }
                e.addEventListener(a, _createResponder(e, a, b), c)
            })
        },
        un: function(a, b, c) {
            return this.each(function(d) {
                var e = _getEventID(d),
                f = _getRespondersForEvent(e, a),
                g = f.length;
                while (g--) if (b === undefined || b.guid === f[g].guid) d.removeEventListener(a, f[g], c),
                removex(cache[e][a], g, 1);
                cache[e][a].length === 0 && delete cache[e][a];
                for (var h in cache[e]) return;
                delete cache[e]
            })
        },
        fire: function(a, b) {
            return this.each(function(c) {
                c == document && !c.dispatchEvent && (c = document.documentElement);
                var d = document.createEvent("HTMLEvents");
                d.initEvent(a, !0, !0),
                d.data = b || {},
                d.eventName = a,
                c.dispatchEvent(d)
            })
        }
    }),
    "click load submit touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend orientationchange".split(" ").forEach(function(a) {
        xui.fn[a] = function(a) {
            return function(b) {
                return b ? this.on(a, b) : this.fire(a)
            }
        } (a)
    }),
    xui(window).on("load", 
    function() {
        "onorientationchange" in document.body || 
        function() {
            var a = window.innerWidth,
            b = window.innerHeight;
            xui(window).on("resize", 
            function() {
                var c = window.innerWidth < a && window.innerHeight > b && window.innerWidth < window.innerHeight,
                d = window.innerWidth > a && window.innerHeight < b && window.innerWidth > window.innerHeight;
                if (c || d) window.orientation = c ? 0: 90,
                x$("body").fire("orientationchange"),
                a = window.innerWidth,
                b = window.innerHeight
            })
        } ()
    }),
    xui.touch = function() {
        try {
            return !! document.createEvent("TouchEvent").initTouchEvent
        } catch(a) {
            return ! 1
        }
    } (),
    _getEventID.id = 1,
    xui.extend({
        tween: function(a, b) {
            var c = function(b) {
                var c = {};
                return "duration after easing".split(" ").forEach(function(b) {
                    a[b] && (c[b] = a[b], delete a[b])
                }),
                c
            },
            d = function(a) {
                var b = [],
                c;
                if (typeof a != string) {
                    for (c in a) b.push(c + ":" + a[c]);
                    b = b.join(";")
                } else b = a;
                return b
            };
            a instanceof Array && a.forEach(function(a) {});
            var e = c(a),
            f = d(a);
            return this.each(function(a) {
                emile(a, f, e, b)
            })
        }
    });
    var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    xui.extend({
        setStyle: function(a, b) {
            return a = a.replace(/\-[a-z]/g, 
            function(a) {
                return a[1].toUpperCase()
            }),
            this.each(function(c) {
                c.style[a] = b
            })
        },
        getStyle: function(a, b) {
            var c = function(a, b) {
                return document.defaultView.getComputedStyle(a, "").getPropertyValue(b.replace(/[A-Z]/g, 
                function(a) {
                    return "-" + a.toLowerCase()
                }))
            };
            return b === undefined ? c(this[0], a) : this.each(function(d) {
                b(c(d, a))
            })
        },
        addClass: function(a) {
            return this.each(function(b) {
                hasClass(b, a) === !1 && (b.className = trim(b.className + " " + a))
            })
        },
        hasClass: function(a, b) {
            var c = this;
            return this.length && 
            function() {
                var d = !1;
                return c.each(function(c) {
                    hasClass(c, a) && (d = !0, b && b(c))
                }),
                d
            } ()
        },
        removeClass: function(a) {
            if (a === undefined) this.each(function(a) {
                a.className = ""
            });
            else {
                var b = getClassRegEx(a);
                this.each(function(a) {
                    a.className = trim(a.className.replace(b, "$1"))
                })
            }
            return this
        },
        css: function(a) {
            for (var b in a) this.setStyle(b, a[b]);
            return this
        }
    });
    var reClassNameCache = {},
    getClassRegEx = function(a) {
        var b = reClassNameCache[a];
        return b || (b = new RegExp("(^|\\s+)" + a + "(?:\\s+|$)"), reClassNameCache[a] = b),
        b
    };
    xui.extend({
        xhr: function(a, b, c) {
            function k() {
                f.readyState == 4 && (delete e.xmlHttpRequest, (f.status === 0 || f.status == 200) && f.handleResp(), /^[45]/.test(f.status) && f.handleError())
            }
            /^(inner|outer|top|bottom|before|after)$/.test(a) || (c = b, b = a, a = "inner");
            var d = c ? c: {};
            typeof c == "function" && (d = {},
            d.callback = c);
            var e = this,
            f = new XMLHttpRequest,
            g = d.method || "get",
            h = d.async || !1,
            i = d.data || null,
            j = 0;
            f.queryString = i,
            f.open(g, b, h);
            if (d.headers) for (; j < d.headers.length; j++) f.setRequestHeader(d.headers[j].name, d.headers[j].value);
            return f.handleResp = d.callback != null ? d.callback: function() {
                e.html(a, this.responseText)
            },
            f.handleError = d.error && typeof d.error == "function" ? d.error: function() {},
            h && (f.onreadystatechange = k, this.xmlHttpRequest = f),
            f.send(i),
            h || k(),
            this
        }
    })
} (),
define("lib/xui", 
function() {});
var Channel = function(a) {
    this.type = a,
    this.handlers = {},
    this.guid = 0,
    this.fired = !1,
    this.enabled = !0
};
Channel.prototype.subscribe = function(a, b) {
    if (a == null) return;
    var c = a;
    return b = b || this.guid++,
    c.observer_guid = b,
    a.observer_guid = b,
    this.handlers[b] = c,
    b
},
Channel.prototype.unsubscribe = function(a) {
    a instanceof Function && (a = a.observer_guid),
    this.handlers[a] = null,
    delete this.handlers[a]
},
Channel.prototype.fire = function(a) {
    var b = !1,
    c,
    d,
    e;
    if (this.enabled) {
        for (c in this.handlers) d = this.handlers[c],
        typeof d == "function" && (e = d.apply(this, arguments) == 0, b = b || e);
        return this.fired = !0,
        this.fireArgs = arguments,
        !b
    }
    return ! 0
},
define("lib/pubsub/channel", 
function() {}),
Pubsub = function() {
    this.channels = {}
},
Pubsub.prototype.publish = function(a) {
    this.channels[a] == undefined && (this.channels[a] = new Channel)
},
Pubsub.prototype.subscribe = function(a, b, c) {
    var d = this.channels[a];
    if (d != undefined) return c != undefined && (b = Util.bind(c, b)),
    d.subscribe(b)
},
Pubsub.prototype.unsubscribe = function(a, b) {
    this.channels[a].unsubscribe(b)
},
Pubsub.prototype.notify = function(a, b) {
    var c = this.channels[a];
    c != undefined && c.fire(b)
},
define("lib/pubsub/Pubsub", 
function() {}),
GEHelpers.prototype.createPointPlacemark = function(a, b) {
    var c = this.ge.createPlacemark(b.id ? b.id: "");
    b.name && c.setName(b.name),
    b.description && c.setDescription(b.description),
    b.standardIcon && !b.icon && (b.icon = "http://maps.google.com/mapfiles/kml/paddle/" + b.standardIcon + ".png");
    if (b.icon) {
        var d = this.ge.createIcon("");
        d.setHref(b.icon);
        var e = this.ge.createStyle("");
        e.getIconStyle().setIcon(d);
        var f = this.ge.createStyleMap("");
        f.setNormalStyle(e),
        f.setHighlightStyle(e),
        c.setStyleSelector(f)
    }
    var g = this.ge.createPoint("");
    return g.setLatitude(a.lat()),
    g.setLongitude(a.lng()),
    c.setGeometry(g),
    this.ge.getFeatures().appendChild(c),
    c
},
GEHelpers.prototype.clearFeatures = function() {
    var a = this.ge.getFeatures(),
    b;
    while (b = a.getLastChild()) a.removeChild(b)
},
GEHelpers.prototype.removeFeature = function(a) {
    var b = this.ge.getFeatures(),
    c = b.getFirstChild();
    while (c) {
        if (c.getId() == a) {
            b.removeChild(c);
            break
        }
        c = c.getNextSibling()
    }
},
GEHelpers.prototype.createLineStyle = function(a) {
    var b = this.ge.createStyle(""),
    c = b.getLineStyle();
    return a.width && c.setWidth(a.width),
    a.color && c.getColor().set(a.color),
    b
},
GEHelpers.prototype.getHeading = function(a, b) {
    lat1 = this.deg2rad(a.lat()),
    lon1 = this.deg2rad(a.lng()),
    lat2 = this.deg2rad(b.lat()),
    lon2 = this.deg2rad(b.lng());
    var c = this.fixAngle(this.rad2deg(Math.atan2(Math.sin(lon2 - lon1) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1))));
    return c
},
GEHelpers.prototype.rad2deg = function(a) {
    return a * 180 / Math.PI
},
GEHelpers.prototype.deg2rad = function(a) {
    return a * Math.PI / 180
},
GEHelpers.prototype.fixAngle = function(a) {
    while (a < -180) a += 360;
    while (a > 180) a -= 360;
    return a
},
GEHelpers.prototype.interpolateLoc = function(a, b, c) {
    return new google.maps.LatLng(a.lat() + c * (b.lat() - a.lat()), a.lng() + c * (b.lng() - a.lng()))
},
GEHelpers.prototype.distance = function(a, b, c, d) {
    return p1 = V3.latLonAltToCartesian([a.lat(), a.lng(), c]),
    p2 = V3.latLonAltToCartesian([b.lat(), b.lng(), d]),
    V3.earthDistance(p1, p2)
},
define("lib/google-earth/geplugin-helpers", 
function() {}),
V3 = {
    EARTH_RADIUS: 6378100,
    dup: function(a) {
        return [a[0], a[1], a[2]]
    },
    toString: function(a) {
        return "[" + a[0] + ", " + a[1] + ", " + a[2] + "]"
    },
    nearlyEqual: function(a, b, c) {
        return c || (c = 1e - 6),
        Math.abs(a[0] - b[0]) <= c && Math.abs(a[1] - b[1]) <= c && Math.abs(a[2] - b[2]) <= c
    },
    cross: function(a, b) {
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
    },
    dot: function(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    },
    add: function(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    },
    sub: function(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    },
    scale: function(a, b) {
        return [a[0] * b, a[1] * b, a[2] * b]
    },
    length: function(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    },
    normalize: function(a) {
        var b = V3.length(a);
        return b <= 0 ? [NaN, NaN, NaN] : V3.scale(a, 1 / b)
    },
    bisect: function(a, b) {
        return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
    },
    rotate: function(a, b, c) {
        var d = V3.dot(a, b),
        e = V3.sub(a, V3.scale(b, d)),
        f = V3.cross(b, e),
        g = V3.add(V3.scale(b, d), V3.add(V3.scale(e, Math.cos(c)), V3.scale(f, Math.sin(c))));
        return g
    },
    toRadians: function(a) {
        return [a[0] * Math.PI / 180, a[1] * Math.PI / 180, a[2] * Math.PI / 180]
    },
    toDegrees: function(a) {
        return [a[0] * 180 / Math.PI, a[1] * 180 / Math.PI, a[2] * 180 / Math.PI]
    },
    latLonAltToCartesian: function(a) {
        var b = Math.sin(a[1] * Math.PI / 180),
        c = Math.cos(a[1] * Math.PI / 180),
        d = Math.sin(a[0] * Math.PI / 180),
        e = Math.cos(a[0] * Math.PI / 180),
        f = V3.EARTH_RADIUS + a[2],
        g = [f * c * e, f * d, f * -b * e];
        return g
    },
    cartesianToLatLonAlt: function(a) {
        var b = V3.length(a);
        if (b <= 0) return [NaN, NaN, NaN];
        var c = b - V3.EARTH_RADIUS,
        d = V3.scale(a, 1 / b),
        e = Math.asin(d[1]) * 180 / Math.PI;
        e > 90 && (e -= 180);
        var f = 0;
        return Math.abs(e) < 90 && (f = Math.atan2(d[2], d[0]) * -180 / Math.PI),
        [e, f, c]
    },
    leftDistance: function(a, b, c) {
        var d = V3.sub(b, a),
        e = V3.sub(c, a),
        f = V3.cross(d, e),
        g = V3.dot(a, f),
        h = V3.length(d);
        if (h < 1e - 6) return NaN;
        var i = V3.length(f) / h;
        return g > 0 ? i: -i
    },
    earthDistance: function(a, b) {
        var c = V3.dot(V3.normalize(a), V3.normalize(b)),
        d = Math.acos(c),
        e = V3.EARTH_RADIUS * d;
        return e
    }
},
M33 = {
    toString: function(a) {
        return "[" + V3.toString(a[0]) + ", " + V3.toString(a[1]) + ", " + V3.toString(a[2]) + "]"
    },
    nearlyEqual: function(a, b) {
        return V3.nearlyEqual(a[0], b[0]) && V3.nearlyEqual(a[1], b[1]) && V3.nearlyEqual(a[2], b[2])
    },
    transpose: function(a) {
        return [[a[0][0], a[1][0], a[2][0]], [a[0][1], a[1][1], a[2][1]], [a[0][2], a[1][2], a[2][2]]]
    },
    multiply: function(a, b) {
        var c = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (var d = 0; d < 3; d++) for (var e = 0; e < 3; e++) c[d][e] = a[0][e] * b[d][0] + a[1][e] * b[d][1] + a[2][e] * b[d][2];
        return c
    },
    transform: function(a, b) {
        return [a[0][0] * b[0] + a[1][0] * b[1] + a[2][0] * b[2], a[0][1] * b[0] + a[1][1] * b[1] + a[2][1] * b[2], a[0][2] * b[0] + a[1][2] * b[1] + a[2][2] * b[2]]
    },
    transformByTranspose: function(a, b) {
        return [a[0][0] * b[0] + a[0][1] * b[1] + a[0][2] * b[2], a[1][0] * b[0] + a[1][1] * b[1] + a[1][2] * b[2], a[2][0] * b[0] + a[2][1] * b[1] + a[2][2] * b[2]]
    },
    identity: function() {
        return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    },
    makeOrthonormalFrame: function(a, b) {
        var c = V3.normalize(V3.cross(a, b)),
        d = V3.normalize(V3.cross(b, c)),
        e = V3.cross(c, d);
        return [c, d, e]
    },
    headingTiltRollToLocalOrientationMatrix: function(a) {
        return M33.eulToMat(V3.toRadians(a))
    },
    localOrientationMatrixToHeadingTiltRoll: function(a) {
        var b = M33.matToEul(a);
        return V3.toDegrees(b)
    },
    makeLocalToGlobalFrame: function(a) {
        var b = V3.normalize(V3.latLonAltToCartesian(a)),
        c = V3.normalize(V3.cross([0, 1, 0], b)),
        d = V3.normalize(V3.cross(b, c));
        return [c, d, b]
    },
    eulerConfig: {
        i: 2,
        j: 0,
        k: 1,
        counterClockwise: !0,
        sameAxis: !1,
        frameRelative: !1
    },
    eulToMat: function(a) {
        var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o = M33.eulerConfig,
        p = o.i,
        q = o.j,
        r = o.k,
        s = V3.dup(a),
        t = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        if (o.frameRelative) {
            var u = s[0];
            s[0] = s[2],
            s[2] = u
        }
        return o.counterClockwise || (s[0] = -s[0], s[1] = -s[1], s[2] = -s[2]),
        b = s[0],
        c = s[1],
        d = s[2],
        e = Math.cos(b),
        f = Math.cos(c),
        g = Math.cos(d),
        h = Math.sin(b),
        i = Math.sin(c),
        j = Math.sin(d),
        k = e * g,
        l = e * j,
        m = h * g,
        n = h * j,
        o.sameAxis ? (t[p][p] = f, t[p][q] = i * h, t[p][r] = i * e, t[q][p] = i * j, t[q][q] = -f * n + k, t[q][r] = -f * l - m, t[r][p] = -i * g, t[r][q] = f * m + l, t[r][r] = f * k - n) : (t[p][p] = f * g, t[p][q] = i * m - l, t[p][r] = i * k + n, t[q][p] = f * j, t[q][q] = i * n + k, t[q][r] = i * l - m, t[r][p] = -i, t[r][q] = f * h, t[r][r] = f * e),
        t
    },
    matToEul: function(a, b) {
        var b = M33.eulerConfig,
        c = b.i,
        d = b.j,
        e = b.k,
        f = 1e - 6,
        g = [0, 0, 0];
        if (b.sameAxis) {
            var h = Math.sqrt(a[c][d] * a[c][d] + a[c][e] * a[c][e]);
            h > 16 * f ? (g[0] = Math.atan2(a[c][d], a[c][e]), g[1] = Math.atan2(h, a[c][c]), g[2] = Math.atan2(a[d][c], -a[e][c])) : (g[0] = Math.atan2( - a[d][e], a[d][d]), g[1] = Math.atan2(h, a[c][c]), g[2] = 0)
        } else {
            var i = Math.sqrt(a[c][c] * a[c][c] + a[d][c] * a[d][c]);
            i > 16 * f ? (g[0] = Math.atan2(a[e][d], a[e][e]), g[1] = Math.atan2( - a[e][c], i), g[2] = Math.atan2(a[d][c], a[c][c])) : (g[0] = Math.atan2( - a[d][e], a[d][d]), g[1] = Math.atan2( - a[e][c], i), g[2] = 0)
        }
        b.counterClockwise || (g[0] = -g[0], g[1] = -g[1], g[2] = -g[2]);
        if (b.frameRelative) {
            var j = g[0];
            g[0] = g[2],
            g[2] = j
        }
        return g
    }
},
define("lib/google-earth/math3d", 
function() {});
var drivingSimulator = new DrivingSimulator;
DrivingSimulator.prototype.init = function(a, b) {
    console.log("Initializing map");
    var c = drivingSimulator,
    d = Emulator.Vehicle.INITIAL_POSITION;
    a && b && (d = {
        coords: {
            latitude: a,
            longitude: b,
            heading: 0,
            altitude: 0
        },
        timestamp: Emulator.Vehicle.CurrentTime
    });
    var e = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: !0,
        scaleControl: !0,
        navigationControl: !0,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeControl: !0,
        center: new google.maps.LatLng(a || d.coords.latitude, b || d.coords.longitude)
    };
    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.CurrentPosition, d),
    c.map = new google.maps.Map(document.getElementById("map"), e),
    c.helpers = new GEHelpers(c.map)
},
DrivingSimulator.prototype.goDirections = function(a) {
    var b = drivingSimulator,
    c = typeof a.callback == "function" ? a.callback: function() {};
    b.directions && (b.directions = null);
    try {
        var d = new google.maps.DirectionsService
    } catch(e) {
        console.error("Failed to load directions: ", e),
        c({
            success: !1
        });
        return
    }
    var f = a.from;
    typeof f != "string" && (f = new google.maps.LatLng(a.from.latitude, a.from.longitude));
    var g = a.to;
    typeof g != "string" && (g = new google.maps.LatLng(a.to.latitude, a.to.longitude));
    var h = [],
    i = document.getElementById("way_point");
    for (var j = 0; j < i.length; j++) i.options[j].selected == 1 && (h.push({
        location: i[j].value,
        stopover: !0
    }), console.log("waypoint selected...:" + i[j].value));
    var k = {
        origin: f,
        destination: g,
        waypoints: h,
        optimizeWaypoints: !0,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    console.log("origin in request object...:" + f),
    console.log("waypoint in request object...:" + h),
    console.log("destination in request object...:" + g),
    d.route(k, 
    function(a, d) {
        if (d === google.maps.DirectionsStatus.OK) {
            b.directions = a,
            b.directionsLoaded();
            var e = b.directions.routes[0].overview_path;
            c({
                success: !0,
                start: e[0],
                waypts: e[e.length - 2],
                end: e[e.length - 1],
                startAddress: b.directions.routes[0].legs[0].start_address,
                endAddress: b.directions.routes[0].legs[0].end_address
            }),
            console.log("directions loaded...."),
            console.log("start in route request.." + e[0]),
            console.log("waypts in route request.." + e[e.length - 2]),
            console.log("end in route request.." + e[e.length - 1]),
            b.directions && console.log("startAddress in route request.." + b.directions.routes[0].legs[0].start_address),
            b.directions && console.log("endAddress in route request.." + b.directions.routes[0].legs[0].end_address)
        } else console.error("Failed to load directions: ", d),
        c({
            success: !1
        })
    })
},
DrivingSimulator.prototype.directionsLoaded = function() {
    this.buildPathStepArrays(),
    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.DirectionsLoaded, !0)
},
DrivingSimulator.prototype.clearPath = function() {
    var a = drivingSimulator;
    a.display && (a.display.setMap(null), a.display = null)
},
DrivingSimulator.prototype.buildPathStepArrays = function() {
    var a = drivingSimulator;
    a.map || a.init(),
    a.steps = [],
    a.path = [],
    a.gm_maneuvers = [],
    a.clearPath();
    var b = [],
    c = a.directions.routes[0].legs[0],
    d = [],
    e;
    for (e in c.steps) c.steps[e] && d.push(c.steps[e].start_location);
    d.push(c.steps[c.steps.length - 1].end_location);
    var f = new google.maps.ElevationService;
    f.getElevationForLocations({
        locations: d
    },
    function(d) {
        var e,
        f;
        for (e in d) d[e] && b.push(d[e].elevation);
        for (e = 0; e < c.steps.length; e++) {
            var g = c.steps[e];
            a.steps.push({
                loc: g.start_location,
                distance: g.distance.value,
                pathIndex: a.path.length
            });
            for (f = 0; f < g.path.length - 1; f++) {
                var h = g.path[f],
                i = b[e] + f * ((b[e + 1] - b[e]) / g.path.length),
                j = b[e] + f + 1 * ((b[e + 1] - b[e]) / g.path.length),
                k = a.helpers.distance(h, g.path[f + 1], i, j);
                a.path.push({
                    loc: h,
                    step: e,
                    distance: k,
                    duration: g.duration.value * k / g.distance.value,
                    elevation: (i + j) / 2
                })
            }
            a.gm_maneuvers.push(DrivingSimulatorUtil.parseGmManeuver(g))
        }
        var l = new google.maps.DirectionsRenderer;
        l.setMap(a.map),
        a.directions && l.setDirections(a.directions),
        a.display = l
    })
};
var DrivingSimulatorUtil = {
    formatTime: function(a) {
        var b = Math.floor(a / 60);
        a %= 60;
        var c = Math.floor(b / 60);
        return b %= 60,
        a = Math.round(a),
        (c < 10 ? "0" + c: c) + ":" + (b < 10 ? "0" + b: b)
    },
    parseGmManeuver: function(a) {
        function b(a) {
            var b = document.createElement("DIV");
            return b.innerHTML = a,
            b.textContent || b.innerText
        }
        var c = b(a.instructions),
        d = GM_CONFIG.Navigation.Maneuvers,
        e = null;
        for (var f = 0; f < d.length; f++) if (d[f].match && c.match(d[f].match)) {
            e = d[f].value;
            break
        }
        var g = a.instructions.match(/<b>((?!<b>).)*\s(n|s|e|w|st|ave|rd)((?!<b>).)*<\/b>/gi);
        return {
            startLat: a.start_location.lat(),
            startLong: a.start_location.lng(),
            maneuverID: f,
            maneuverNum: f,
            maneuverType: e,
            street: g != null ? b(g[0]) : null,
            distance: a.distance.text,
            duration: a.duration.text
        }
    }
};
DrivingSimulator.prototype.controlSimulator = function(a, b) {
    var c = drivingSimulator,
    d = typeof a == "string" ? a: a.event.target.value,
    e = b && b.callback ? b.callback: function() {};
    switch (d) {
    case "reset":
        c.dsTimer && c.dsTimer.destroy(),
        Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Speed_Information.average_speed.model.key, 0),
        c.clearPath(),
        c.dsTimer = new DrivingSimulatorTimer(c.map, c.path, {
            on_tick: function() {
                if (c.dsTimer) {
                    Emulator.incrementTime(),
                    Emulator.setValue("DS_TotalTime", DrivingSimulatorUtil.formatTime(c.dsTimer.totalTime));
                    var a = Emulator.getValue(GM_CONFIG.ModelKeys.Driving.OdometerOffset);
                    a || (a = 0),
                    Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Odo_LS.odometer.model.key, Math.round(c.dsTimer.totalDistance / 1e3 * 10) / 10 + a);
                    var b = Math.round(c.dsTimer.currentSpeed / .44704),
                    d = b / 3.6 * 1.6;
                    Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status) !== GM_CONFIG.DRIVE_STATES.PARK && Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Speed_Information.average_speed.model.key, d),
                    c.map.panTo(c.dsTimer.currentLoc),
                    c.mapMarker.setPosition(c.dsTimer.currentLoc);
                    var e = {
                        coords: {
                            latitude: c.dsTimer.currentLoc.lat(),
                            longitude: c.dsTimer.currentLoc.lng(),
                            heading: c.dsTimer.heading,
                            altitude: c.dsTimer.elevation
                        },
                        timestamp: Emulator.Vehicle.CurrentTime
                    };
                    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.CurrentPosition, e)
                }
            }
        }),
        c.mapMarker || (c.mapMarker = new google.maps.Marker({
            map: c.map,
            position: c.dsTimer.currentLoc
        })),
        c.map.setZoom(13),
        c.mapMarker.setPosition(c.dsTimer.currentLoc),
        c.updateSpeedIndicator(),
        c.dsTimer.finishInitUI_(e);
        break;
    case "start":
        c.dsTimer ? (c.dsTimer.start(), c.running = !0, e && e()) : c.controlSimulator("reset", {
            callback: function() {
                c.dsTimer.start(),
                c.running = !0,
                e && e()
            }
        }),
        Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status) !== GM_CONFIG.DRIVE_STATES.DRIVE && Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, GM_CONFIG.DRIVE_STATES.DRIVE);
        break;
    case "pause":
        c.dsTimer && c.dsTimer.stop(),
        c.previousState = Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status),
        c.previousState !== GM_CONFIG.DRIVE_STATES.PARK && (Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, GM_CONFIG.DRIVE_STATES.PARK), Emulator.setValue(GM_CONFIG.VehicleData.Vehicle_Speed_Information.average_speed.model.key, 0)),
        e && e();
        break;
    case "resume":
        c.dsTimer && c.dsTimer.start(),
        Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status) == GM_CONFIG.DRIVE_STATES.PARK && Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, c.previousState),
        e && e();
        break;
    default:

    }
},
DrivingSimulator.prototype.updateSpeedIndicator = function(a, b) {
    var c = drivingSimulator,
    d;
    a ? (d = a.value, c.dsTimer && (c.dsTimer.options.speed = d)) : d = c.dsTimer.options.speed;
    var e = x$(".speed-selector")[0];
    if (parseFloat(e.options[e.selectedIndex].value) !== d) {
        var f;
        for (f = 0; f < e.childNodes.length; f++) {
            var g = e.childNodes[f];
            parseFloat(g.value) === d ? g.selected = !0: g.selected = null
        }
    }
},
DrivingSimulator.prototype.updateDriveStatus = function(a) {
    var b = a.value;
    if (!drivingSimulator.running) return;
    switch (b) {
    case GM_CONFIG.DRIVE_STATES.PARK:
        drivingSimulator.controlSimulator("pause");
        break;
    default:
        drivingSimulator.controlSimulator("resume")
    }
},
define("lib/driving-simulator", 
function() {}),
TICK_SIM_MS = 250,
DrivingSimulatorTimer.prototype.totalTime = 0,
DrivingSimulatorTimer.prototype.totalDistance = 0,
DrivingSimulatorTimer.prototype.currentSpeed = 0,
DrivingSimulatorTimer.prototype.currentLoc = null,
DrivingSimulatorTimer.prototype.finishInitUI_ = function(a) {
    this.heading = this.geHelpers_.getHeading(this.path[0].loc, this.path[1].loc);
    var b = this;
    this.tickListener = function() {
        b.doTick_ && b.tick_()
    },
    this.interval = setInterval(this.tickListener, TICK_SIM_MS),
    a && a()
},
DrivingSimulatorTimer.prototype.destroy = function() {
    this.stop(),
    Emulator.getValue(GM_CONFIG.ModelKeys.Driving.Status) !== GM_CONFIG.DRIVE_STATES.PARK && Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Status, GM_CONFIG.DRIVE_STATES.PARK),
    clearInterval(this.interval)
},
DrivingSimulatorTimer.prototype.start = function() {
    if (this.doTick_) return;
    this.doTick_ = !0,
    this.tick_()
},
DrivingSimulatorTimer.prototype.stop = function() {
    if (!this.doTick_) return;
    this.doTick_ = !1
},
DrivingSimulatorTimer.prototype.tick_ = function() {
    if (this.pathIndex_ >= this.path.length - 1) {
        this.doTick_ = !1;
        return
    }
    this.path[this.pathIndex_].step !== this.currentStep_ && (this.currentStep_ = this.path[this.pathIndex_].step),
    this.totalTime += TICK_SIM_MS * this.options.speed / 1e3,
    this.segmentTime_ += TICK_SIM_MS * this.options.speed / 1e3;
    var a = this.path[this.pathIndex_].duration;
    this.beforeSegmentDistance_ || (this.beforeSegmentDistance_ = 0);
    while (this.pathIndex_ < this.path.length - 1 && this.segmentTime_ >= a) this.segmentTime_ -= a,
    this.beforeSegmentDistance_ += this.path[this.pathIndex_].distance,
    this.segmentDistance_ = 0,
    this.pathIndex_++,
    a = this.path[this.pathIndex_].duration;
    a ? (this.segmentDistance_ = this.path[this.pathIndex_].distance * Math.min(1, this.segmentTime_ / a), this.currentSpeed = this.path[this.pathIndex_].distance / a) : (this.segmentDistance_ = 0, this.currentSpeed = 0),
    this.currentSpeed = this.currentSpeed * 3.6,
    this.totalDistance = this.beforeSegmentDistance_ + this.segmentDistance_;
    if (this.pathIndex_ >= this.path.length - 1) {
        this.doTick_ = !1;
        return
    }
    this.currentLoc = this.geHelpers_.interpolateLoc(this.path[this.pathIndex_].loc, this.path[this.pathIndex_ + 1].loc, this.segmentTime_ / this.path[this.pathIndex_].duration),
    this.heading = this.geHelpers_.getHeading(this.path[this.pathIndex_].loc, this.path[this.pathIndex_ + 1].loc),
    this.elevation = this.path[this.pathIndex_].elevation,
    this.options.on_tick && this.options.on_tick()
},
define("lib/driving-simulator-timer", 
function() {}),
Model.prototype = {
    set: function(a, b) {
        var c = this.get(a);
        this.lawnchair.save({
            key: a,
            value: b
        }),
        this.channels[a] === undefined && (this.channels[a] = {},
        this.channels[a].onChange = new Channel, this.channels[a].onDelete = new Channel),
        this.channels[a].onChange.fire({
            oldValue: c
        })
    },
    get: function(a) {
        var b = null;
        return this.lawnchair.get(a, 
        function(a) {
            b = a ? a.value: null
        }),
        typeof b == "string" && b.match(/^[0-9\.]+$/) && (b *= 1),
        b == "true" && (b = !0),
        b == "false" && (b = !1),
        b
    },
    getRef: function(a) {
        return this.channels[a] === undefined && this.set(a, null),
        {
            model: this,
            key: a,
            channel: this.channels[a]
        }
    }
},
define("model/model", 
function() {}),
UIControllerGroup.prototype.createController = function(a, b) {
    var c = new UIControllerBase;
    return c.controller = new BaseController(a),
    Emulator.addController(c.controller, b),
    this.controllers.push(c),
    c
},
UIControllerGroup.prototype.getUI = function(a, b, c, d) {
    var e = [],
    f;
    for (f = 0; f < this.controllers.length; f++) e = e.concat(this.controllers[f].getUI());
    return e
},
define("controller/ui-controller-group", 
function() {}),
VehicleConfigurationSettingController.prototype = new UIControllerBase,
define("controller/settings/vehicle-configuration-controller", 
function() {}),
VehicleDataSettingController.prototype = new UIControllerBase,
VehicleDataSettingController.prototype.addDTCTable = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry),
    c = 0;
    for (var d = 0; d < b.length; d++) b[d].tableID >= c && (c = b[d].tableID + 1);
    a.tableID = c,
    b.push(a),
    Emulator.setValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry, b)
},
VehicleDataSettingController.prototype.removeDTCTable = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry);
    for (var c = 0; c < b.length; c++) if (a == b[c].tableID) {
        b.splice(c, 1);
        break
    }
    Emulator.setValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry, b)
},
VehicleDataSettingController.prototype.saveDTCTable = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry);
    for (var c = 0; c < b.length; c++) if (b[c].tableID == a.tableID) {
        b[c] = a;
        break
    }
    Emulator.setValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry, b)
},
VehicleDataSettingController.prototype.renderView = function() {
    this.view.renderDTCTable("#DTC_Section", Emulator.getValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry), GM_CONFIG.VehicleData.DTC_Table_Entry)
},
VehicleDataSettingController.prototype.onDTCDeviceChange = function(a) {
    this.renderView();
    for (var b in this.watchHandles) this.watchHandles[b]()
},
VehicleDataSettingController.prototype.addWatchHandle = function(a) {
    return this.watchHandleCount++,
    this.watchHandles[this.watchHandleCount] = a,
    this.watchHandleCount
},
define("controller/settings/vehicle-data-controller", 
function() {}),
RadioSettingController.prototype = new UIControllerBase,
RadioSettingController.prototype.sendSDARS = function(a) {
    Emulator.PubSub.notify(GM_CONFIG.Events.SEND_SDARS, a)
},
define("controller/settings/radio-controller", 
function() {}),
NetworkSettingController.prototype = new UIControllerBase,
NetworkSettingController.prototype.addNetworkDevice = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Network.DeviceList),
    c = 0;
    for (var d = 0; d < b.length; d++) b[d].id >= c && (c = b[d].id + 1);
    a.id = b.length,
    b.push(a),
    Emulator.setValue(GM_CONFIG.ModelKeys.Network.DeviceList, b)
},
NetworkSettingController.prototype.removeNetworkDevice = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Network.DeviceList);
    for (var c = 0; c < b.length; c++) if (a == b[c].id) {
        b.splice(c, 1);
        break
    }
    Emulator.setValue(GM_CONFIG.ModelKeys.Network.DeviceList, b)
},
NetworkSettingController.prototype.saveNetworkDevice = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Network.DeviceList);
    for (var c = 0; c < b.length; c++) if (b[c].id == a.id) {
        b[c] = a;
        break
    }
    Emulator.setValue(GM_CONFIG.ModelKeys.Network.DeviceList, b)
},
NetworkSettingController.prototype.renderView = function() {
    this.view.render(Emulator.getValue(GM_CONFIG.ModelKeys.Network.DeviceList), GM_CONFIG.NETWORK_MANAGER.Device_Schema)
},
NetworkSettingController.prototype.onNetworkDeviceChange = function(a) {
    var b = a.value,
    c = !1;
    for (var d in b) if (b[d].connectionStatus == GM_CONFIG.NETWORK_MANAGER.Connection_Statuses.ENABLED_ACTIVE) {
        c = !0;
        break
    }
    Emulator.setValue(GM_CONFIG.ModelKeys.Network.NetworkConnectivity, c),
    Emulator.PubSub.notify(GM_CONFIG.Events.DEVICE_CONNECTION, a),
    this.renderView()
},
define("controller/settings/network-controller", 
function() {}),
BluetoothSettingController.prototype = new UIControllerBase,
BluetoothSettingController.prototype.addBluetoothService = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Bluetooth.ServiceList);
    b.push(a),
    Emulator.setValue(GM_CONFIG.ModelKeys.Bluetooth.ServiceList, b)
},
BluetoothSettingController.prototype.removeBluetoothService = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Bluetooth.ServiceList),
    c = b.splice(a, 1);
    Emulator.setValue(GM_CONFIG.ModelKeys.Bluetooth.ServiceList, b)
},
BluetoothSettingController.prototype.renderView = function() {
    this.view.render(Emulator.getValue(GM_CONFIG.ModelKeys.Bluetooth.ServiceList), GM_CONFIG.BT_SERVICES.Schema)
},
BluetoothSettingController.prototype.onBluetoothServiceChange = function(a) {
    var b = a.value;
    this.renderView()
},
define("controller/settings/bluetooth-settings-controller", 
function() {}),
GeneralSettingsController.prototype = new UIControllerBase,
define("controller/settings/general-settings-controller", 
function() {}),
SettingsOverlayController.prototype = new UIControllerGroup,
define("controller/settings/settings-overlay-controller", 
function() {}),
Util.extend(MenuPanelController, UIControllerBase),
define("controller/menu-panel-controller", 
function() {}),
RotaryPanelController.prototype = new UIControllerBase,
define("controller/rc-panel-controller", 
function() {}),
SoftButtonsPanelController.prototype = new UIControllerBase,
define("controller/soft-buttons-panel-controller", 
function() {}),
SmallScreenPanelController.prototype = new UIControllerGroup,
SmallScreenPanelController.prototype.setScreenSize = function(a) {
    var b = x$("#screen_panel");
    a >= 8 ? b.removeClass("small") : b.addClass("small")
},
define("controller/small-screen-panel-controller", 
function() {}),
SteeringWheelPanelController.prototype = new UIControllerBase,
SteeringWheelPanelController.prototype.steeringWheelClicked = function(a) {
    var b = this;
    switch (a) {
    case "SWC_VOL_UP":
        Emulator.PubSub.notify(GM_CONFIG.Events.VOLUME_UP_CLICKED);
        break;
    case "SWC_VOL_DOWN":
        Emulator.PubSub.notify(GM_CONFIG.Events.VOLUME_DOWN_CLICKED)
    }
},
define("controller/swc-panel-controller", 
function() {}),
NavigationPanelController.prototype = new UIControllerBase,
NavigationPanelController.prototype.setLocation = function(a) {
    Emulator.lookupAddress(a, Util.bind(this, 
    function(a) {
        a == null ? this.view.onError.fire("Failed to look up address") : (drivingSimulator.running && drivingSimulator.controlSimulator("pause"), Emulator.setLocation({
            latitude: Emulator.secToArcMs(a.latitude),
            longitude: Emulator.secToArcMs(a.longitude)
        }), a.nice_address && (x$("#location")[0].value = a.nice_address), drivingSimulator.init(a.latitude, a.longitude), x$("#load_route_prompt").addClass("hide"))
    }))
},
NavigationPanelController.prototype.goDirectionsCallback = function(a) {
    a.success && (Emulator.setLocation({
        latitude: Emulator.secToArcMs(a.start.lat()),
        longitude: Emulator.secToArcMs(a.start.lng())
    }), Emulator.setDestination({
        latitude: Emulator.secToArcMs(a.end.lat()),
        longitude: Emulator.secToArcMs(a.end.lng())
    })),
    console.log("r.start.lat() in setLocation in goDirectionsCallback..." + a.start.lat()),
    console.log("r.start.lng() in setLocation in goDirectionsCallback..." + a.start.lng()),
    console.log("r.end.lat() in setDestination in goDirectionsCallback..." + a.end.lat()),
    console.log("r.end.lng() in setDestination in goDirectionsCallback..." + a.end.lng())
},
NavigationPanelController.prototype.destinationChanged = function(a) {
    drivingSimulator.running && drivingSimulator.controlSimulator("pause");
    var b = Emulator.getValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_lat.model.key),
    c = Emulator.getValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_long.model.key);
    drivingSimulator.goDirections({
        from: {
            latitude: Emulator.arcMsToSec(b),
            longitude: Emulator.arcMsToSec(c)
        },
        to: {
            latitude: Emulator.arcMsToSec(a.value.latitude),
            longitude: Emulator.arcMsToSec(a.value.longitude)
        },
        callback: function(a) {
            x$("#start_route")[0].value = a.startAddress,
            x$("#way_point")[0].value = a.wayPoint,
            x$("#end_route")[0].value = a.endAddress
        }
    }),
    console.log("from latitude  in goDirections...." + Emulator.arcMsToSec(b)),
    console.log("from longitude  in goDirections...." + Emulator.arcMsToSec(c)),
    console.log("to latitude  in goDirections...." + Emulator.arcMsToSec(a.value.latitude)),
    console.log("to longitude  in goDirections...." + Emulator.arcMsToSec(a.value.longitude))
},
define("controller/navigation-panel-controller", 
function() {}),
define("controller/ignition-overlay-controller", 
function() {}),
HomeScreenController.prototype.lockApps = function(a, b) {
    for (var c in Emulator.apps) {
        var d = Emulator.apps[c].config.VehicleStatus;
        if (d == GM_CONFIG.DRIVE_STATES.PARK) switch (a.value) {
        case GM_CONFIG.DRIVE_STATES.PARK:
            this.view.unlockApp(c);
            break;
        default:
            this.view.lockApp(c)
        } else if (d == GM_CONFIG.DRIVE_STATES.LOWSPEED) switch (a.value) {
        case GM_CONFIG.DRIVE_STATES.PARK:
        case GM_CONFIG.DRIVE_STATES.LOWSPEED:
        case GM_CONFIG.DRIVE_STATES.REVERSE:
            this.view.unlockApp(c);
            break;
        default:
            this.view.lockApp(c)
        } else d == GM_CONFIG.DRIVE_STATES.DRIVE && this.view.unlockApp(c)
    }
},
HomeScreenController.prototype.setAppFriendlyName = function(a) {
    var b = a.name,
    c = a.failure;
    typeof c != "function" && (c = function() {});
    if (typeof b != "string") {
        c(GM_CONFIG.FailureCodes.INVALID_INPUT_PARAMS);
        return
    }
    var d = Emulator.getRequestingApp(),
    e = Emulator.apps[d];
    typeof e != "undefined" ? (e.set("name", b), e.config.FriendlyName = b, this.view.render(Emulator.apps)) : c(GM_CONFIG.FailureCodes.UNKOWN)
},
HomeScreenController.prototype.setHomeScreenLocation = function(a, b) {
    for (var c in Emulator.apps) Emulator.apps[c].position == a && (Emulator.apps[c].position = -1);
    Emulator.apps[b].position = a,
    this.view.render(Emulator.apps)
},
define("controller/home-screen-controller", 
function() {}),
TimePanelController.prototype = new UIControllerBase,
define("controller/time-panel-controller", 
function() {}),
OnscreenController.prototype = new UIControllerGroup,
define("controller/onscreen-controller", 
function() {}),
NativeAppController.prototype = new UIControllerBase,
NativeAppController.prototype.nativeAppRequestHandler = function(a) {
    a.method == "close" ? this.view.hideNativeApp(a.target ? a.target: null) : a.method == "show" && this.view.showNativeApp(a)
},
define("controller/native-app-controller", 
function() {}),
DebugPanelController.prototype = new UIControllerBase,
DebugPanelController.prototype.reloadApp = function(a) {
    var b = Emulator.getVisibleAppID();
    this.killCurrentApp(),
    Emulator.PubSub.notify(GM_CONFIG.Events.LAUNCH_APP, {
        success: function() {},
        failure: function() {},
        appID: b
    })
},
DebugPanelController.prototype.reloadAll = function(a) {
    window.location.reload()
},
DebugPanelController.prototype.killCurrentApp = function(a) {
    Emulator.PubSub.notify(GM_CONFIG.Events.CLOSE_APP, {
        success: function() {},
        failure: function() {},
        appID: Emulator.getVisibleAppID()
    })
},
DebugPanelController.prototype.killAllApps = function(a) {
    Emulator.PubSub.notify(GM_CONFIG.Events.CLOSE_APP, {
        success: function() {},
        failure: function() {},
        appID: "ALL"
    })
},
define("controller/debug-panel-controller", 
function() {}),
InteractionSelectorController.prototype = new UIControllerBase,
InteractionSelectorController.prototype.render = function(a, b) {
    this.view.render(a, b)
},
define("controller/interaction-selector-controller", 
function() {}),
POISearchController.prototype = new UIControllerBase,
POISearchController.prototype.submitPOISearch = function(a) {
    var b = {
        type: "Search",
        object: {
            inString: a.search,
            maxResults: 20,
            onRoute: !1,
            searchLat: Emulator.getValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_lat.key),
            searchLong: Emulator.getValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_long.key),
            sorting: "Default",
            radius: 1
        }
    };
    this.view.showSearchResults(!0),
    Emulator.setValue(GM_CONFIG.ModelKeys.POISearch.POISearchResults, {}),
    Emulator.PubSub.notify(GM_CONFIG.POISearch.APP_WATCH, b)
},
POISearchController.prototype.requestAutocompleteResults = function(a) {
    var b = {
        type: "Autocomplete",
        object: {
            inString: a.search,
            maxResults: 20,
            onRoute: !1,
            searchLat: Emulator.getValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_lat.key),
            searchLong: Emulator.getValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_long.key),
            sortOrder: "Alphabetic",
            radius: 1
        }
    };
    Emulator.PubSub.notify(GM_CONFIG.POISearch.APP_WATCH, b)
},
POISearchController.prototype.searchResultsHandler = function(a) {
    console.log("searchResultsHandler: ", a);
    var b = a.resultList,
    c = a.searchHandle,
    d = a.appID;
    if (a.type == "Search") {
        var e = Emulator.getValue(GM_CONFIG.ModelKeys.POISearch.POISearchResults);
        e == null && (e = {}),
        e[d] = b,
        Emulator.setValue(GM_CONFIG.ModelKeys.POISearch.POISearchResults, e),
        this.view.renderSearchResults(e)
    } else a.type == "Autocomplete" && this.view.renderAutocompleteResults(a.resultList)
},
define("controller/poisearch-controller", 
function() {}),
PhoneSettingsController.prototype = new UIControllerBase,
PhoneSettingsController.prototype.sendDataToVehicle = function(a) {
    console.log("sendatacontroller"),
    Emulator.PubSub.notify(GM_CONFIG.Events.SEND_FROM_PHONE, a)
},
define("controller/settings/phone-controller", 
function() {}),
MediaPlayerController.prototype = new UIControllerBase,
MediaPlayerController.prototype.playVideo = function(a) {
    var b = a.filename;
    if (b.search(/:\//) < 0) b = Emulator.getDirName() + "/" + b;
    else if (gm.hmi.getNetworkConnectivity() == 0) {
        a.failure({
            errorCode: 4,
            position: 0
        });
        return
    }
    this.videoCallback = a.status || 
    function() {},
    Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
        method: "show",
        target: "video_container"
    }),
    this.videoIsPlaying = !0,
    this.currentVideoAppID = a.appID,
    this.currentVideoHandle = a.handle,
    this.player.playVideo(b, a.handle)
},
MediaPlayerController.prototype.pauseVideo = function(a) {
    this.player.pauseVideo(a.handle)
},
MediaPlayerController.prototype.stopVideo = function(a) {
    this.player.stopVideo(a.handle)
},
MediaPlayerController.prototype.seekVideo = function(a) {
    this.player.seekVideo(a.position, a.handle)
},
MediaPlayerController.prototype.onVideoStopped = function(a) {
    Emulator.PubSub.notify(GM_CONFIG.Events.NATIVE_APP, {
        method: "close",
        target: "video_container"
    }),
    this.videoIsPlaying == 1 && (this.videoIsPlaying = !1, this.videoCallback(a))
},
MediaPlayerController.prototype.isVideoPlaying = function(a) {
    return this.player.isVideoPlaying(a)
},
MediaPlayerController.prototype.getNewVideoHandle = function() {
    return this.videoHandle++
},
MediaPlayerController.prototype.getVideoPosition = function(a) {
    return this.player.getVideoPosition(a)
},
MediaPlayerController.prototype.startTTS = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.VehicleConfig.Language);
    GM_CONFIG.Languages[b].code != "" ? b = GM_CONFIG.Languages[b].code: b = GM_CONFIG.Languages[0].code,
    this.player.startTTS(a.text, a.handle, b),
    this.ttsCallbacks[a.handle] = function(b) {
        b.error == 1 ? a.failure() : a.success()
    }
},
MediaPlayerController.prototype.stopTTS = function(a) {
    document.mediaPlayer.stopTTS(a.handle)
},
MediaPlayerController.prototype.onTTSComplete = function(a) {
    this.ttsCallbacks[a.handle](a)
},
MediaPlayerController.prototype.getNewTTSHandle = function() {
    return this.ttsHandle++
},
MediaPlayerController.prototype.playAudio = function(a) {
    var b = a.filename;
    typeof a.failure != "function" && (a.failure = function() {});
    if (GM_CONFIG.Audio.EXCLUSIVE_AUDIO.toLowerCase() == a.channel.toLowerCase()) a.channel = GM_CONFIG.Audio.EXCLUSIVE_AUDIO;
    else if (GM_CONFIG.Audio.MIXED_AUDIO.toLowerCase() == a.channel.toLowerCase()) a.channel = GM_CONFIG.Audio.MIXED_AUDIO;
    else {
        a.failure(GM_CONFIG.FailureCodes.INVALID_INPUT_PARAMS);
        return
    }
    if (b.search(/:\//) < 0) b = Emulator.getDirName() + "/" + b;
    else if (gm.hmi.getNetworkConnectivity() == 0) {
        a.failure({
            errorCode: gm.constants.media.AUDIO_CHANNEL_UNAVAIL,
            position: 0
        });
        return
    }
    this.audioCallbacks[a.handle] = a.failure,
    this.player.playAudio(a.handle, a.appID, b, a.channel)
},
MediaPlayerController.prototype.pauseAudio = function(a) {
    this.player.pauseAudio(a.handle)
},
MediaPlayerController.prototype.stopAudio = function(a) {
    this.player.stopAudio(a.handle)
},
MediaPlayerController.prototype.seekAudio = function(a) {
    this.player.seekAudio(a.handle, a.position)
},
MediaPlayerController.prototype.onAudioStopped = function(a) {
    var b = this.audioCallbacks[a.handle];
    typeof b == "function" && b(a.code)
},
MediaPlayerController.prototype.getNewAudioHandle = function() {
    return this.audioHandle++
},
MediaPlayerController.prototype.getMediaPlayerList = function(a) {
    typeof a.failure != "function" && (a.failure = function() {});
    if (GM_CONFIG.Audio.SONG.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.SONG;
    else if (GM_CONFIG.Audio.PODCAST.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.PODCAST;
    else if (GM_CONFIG.Audio.AUDIO_BOOK.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.AUDIO_BOOK;
    else if (GM_CONFIG.Audio.VIDEO.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.VIDEO;
    else if (GM_CONFIG.Audio.PLAYLIST.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.PLAYLIST;
    else if (GM_CONFIG.Audio.GENRE.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.GENRE;
    else if (GM_CONFIG.Audio.ARTIST.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.ARTIST;
    else if (GM_CONFIG.Audio.ALBUM.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.ALBUM;
    else if (GM_CONFIG.Audio.AUTHOR.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.AUTHOR;
    else if (GM_CONFIG.Audio.COMPOSER.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.COMPOSER;
    else {
        a.failure(GM_CONFIG.FailureCodes.INVALID_INPUT_PARAMS);
        return
    }
    console.log("getMediaPlayerList")
},
MediaPlayerController.prototype.getMediaPlayerResultsNum = function(a) {
    typeof a.failure != "function" && (a.failure = function() {});
    if (GM_CONFIG.Audio.SONG.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.SONG;
    else if (GM_CONFIG.Audio.PODCAST.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.PODCAST;
    else if (GM_CONFIG.Audio.AUDIO_BOOK.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.AUDIO_BOOK;
    else if (GM_CONFIG.Audio.VIDEO.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.VIDEO;
    else if (GM_CONFIG.Audio.PLAYLIST.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.PLAYLIST;
    else if (GM_CONFIG.Audio.GENRE.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.GENRE;
    else if (GM_CONFIG.Audio.ARTIST.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.ARTIST;
    else if (GM_CONFIG.Audio.ALBUM.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.ALBUM;
    else if (GM_CONFIG.Audio.AUTHOR.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.AUTHOR;
    else if (GM_CONFIG.Audio.COMPOSER.toLowerCase() == a.type.toLowerCase()) a.type = GM_CONFIG.Audio.COMPOSER;
    else {
        a.failure(GM_CONFIG.FailureCodes.INVALID_INPUT_PARAMS);
        return
    }
    console.log("getMediaPlayerResultsNum")
},
MediaPlayerController.prototype.volumeDown = function() {
    var a = this.currentVolume - GM_CONFIG.Audio.INCREMENT;
    if (0 <= a && a <= 1) {
        try {
            this.player.setVolume(a)
        } catch(b) {
            console.error(b.message)
        }
        this.currentVolume = a
    }
    Emulator.PubSub.notify(GM_CONFIG.Events.UPDATE_VOLUME, {
        volume: this.currentVolume
    })
},
MediaPlayerController.prototype.volumeUp = function() {
    var a = this.currentVolume + GM_CONFIG.Audio.INCREMENT;
    if (0 <= a && a <= 1) {
        try {
            this.player.setVolume(a)
        } catch(b) {
            console.error(b.message)
        }
        this.currentVolume = a
    }
    Emulator.PubSub.notify(GM_CONFIG.Events.UPDATE_VOLUME, {
        volume: this.currentVolume
    })
},
MediaPlayerController.prototype.appClosed = function(a) {
    try {
        this.player.stopApp(a.appID),
        this.currentVideoAppID == a.appID && this.videoIsPlaying == 1 && this.stopVideo({
            handle: this.currentVideoHandle
        })
    } catch(b) {
        console.error(b.message)
    }
},
define("controller/mediaplayer-controller", 
function() {}),
AppController.prototype = new UIControllerBase,
AppController.prototype.createApp = function(a) {
    var b = a.id,
    c = a.src,
    d = x$("#applications"),
    e = document.createElement("iframe");
    e.setAttribute("id", b),
    e.setAttribute("name", b),
    e.setAttribute("frameborder", "0"),
    e.setAttribute("scrolling", "yes"),
    e.setAttribute("class", "iframe res_large");
    var f = Emulator.getAppIDFromString(b);
    b != "browserApp" && (Emulator.GM_OBJECTS_INJECTED_BY_SERVER == 0 || typeof Emulator.apps[f].config.SourceLocation == "string" && Emulator.apps[f].config.SourceLocation.toLowerCase() == "remote") && e.setAttribute("onload", "console.log('attaching gm object in iframe onload event (app id: " + f + ")');" + "var win = this.contentWindow;" + "if (win.gm) {" + "\twin.gm_old = this.contentWindow.gm;" + "\twin.gm = gm;" + "\tfor (var att in win.gm_old) {" + "\t\twin.gm[att] = win.gm_old[att];" + "\t}" + "\tdelete win.gm_old;" + "} else { win.gm = gm }"),
    e.setAttribute("src", c + window.location.search),
    d[0].appendChild(e),
    Emulator.apps[f].background && Emulator.apps[f].background == 1 && x$(e).addClass("background"),
    x$("#icon-" + b).addClass("running"),
    Emulator.PubSub.notify(GM_CONFIG.Events.APP_STATE_CHANGE, {
        appID: f
    }),
    Emulator.PubSub.notify(GM_CONFIG.Events.FOCUS_APP, {
        success: function() {},
        failure: function() {},
        appID: f
    })
},
AppController.prototype.autoStartApps = function() {
    for (var a in Emulator.apps) a = parseInt(a),
    Emulator.apps[a].config.AutoStart.toLowerCase() == "true" && (Emulator.apps[a].autoStartInitiated = !0, this.launchApp({
        success: function() {
            Emulator.log("autostarted app " + a)
        },
        failure: function() {},
        appID: a
    }))
},
AppController.prototype.requestFocus = function(a) {
    var b = a.success,
    c = a.failure,
    d = a.appID,
    e = x$("#applications .iframe.active"),
    f = x$("#applications .iframe"),
    g = x$("#" + Emulator.getAppString(d)),
    h = !1;
    if (g.length > 0) if (d == Emulator.getVisibleAppID()) h = !0;
    else if (! (Emulator.appIsLocked(d) || Emulator.apps[d] && Emulator.apps[d].config.Render == GM_CONFIG.AppConfig.Rendering.BACKGROUND)) if (Emulator.apps[d] && Emulator.apps[d].autoStartInitiated) Emulator.apps[d].autoStartInitiated = !1;
    else {
        var i = Emulator.getAppIDFromString(e[0].id);
        f.removeClass("active"),
        g.addClass("active"),
        Emulator.interactionSelectorController.onCurrentAppChanged.fire(d);
        function j(a, b) {
            for (var c in gm.appmanager._focusSubscriptions) {
                var d = gm.appmanager._focusSubscriptions[c];
                d.appID == a ? d.callback.call(null, GM_CONFIG.FocusStates.FOREGROUND) : d.appID == b && d.callback.call(null, GM_CONFIG.FocusStates.BACKGROUND)
            }
        }
        j(d, i),
        Emulator.PubSub.notify(GM_CONFIG.Events.APP_STATE_CHANGE, {
            appID: d
        }),
        Emulator.PubSub.notify(GM_CONFIG.Events.APP_STATE_CHANGE, {
            appID: i
        }),
        h = !0
    }
    h ? b.call(this) : c.call(this)
},
AppController.prototype.closeApp = function(a) {
    var b = a.success,
    c = a.failure,
    d = a.appID;
    if (d == Emulator.HOME_SCREEN_ID) {
        failureFunc.call(this, arguments);
        return
    }
    if (d == "ALL") for (var e in Emulator.apps) this.closeApp({
        success: function() {},
        failure: function() {},
        appID: e
    });
    var f = Emulator.getAppString(d),
    g = x$("#" + f);
    if (g.length == 0) {
        c.call(this, arguments);
        return
    }
    var h = typeof a.type == "undefined" ? GM_CONFIG.Shutdown.SYSTEM: a.type;
    Emulator.PubSub.notify(GM_CONFIG.Communication.SHUTDOWN_WATCH_PREFIX + d, {
        type: h
    }),
    g.hasClass("active") && Emulator.PubSub.notify(GM_CONFIG.Events.FOCUS_APP, {
        success: function() {},
        failure: function() {},
        appID: Emulator.HOME_SCREEN_ID
    }),
    g[0].parentNode.removeChild(g[0]),
    x$("#icon-" + f).removeClass("running"),
    Emulator.PubSub.notify(GM_CONFIG.Events.APP_CLOSED, {
        appID: d
    }),
    Emulator.PubSub.notify(GM_CONFIG.Events.APP_STATE_CHANGE, {
        appID: d
    }),
    typeof b == "function" && b.call(this)
},
AppController.prototype.launchApp = function(a) {
    var b = a.success,
    c = a.failure,
    d = a.appID,
    e = Emulator.getAppString(d);
    if (Emulator.apps[d] === undefined) {
        c.call(this, arguments);
        return
    }
    var f = x$("#applications"),
    g = f.find("#" + e);
    if (Emulator.isAppRunning(d) == 1) {
        Emulator.PubSub.notify(GM_CONFIG.Events.FOCUS_APP, {
            success: b,
            failure: c,
            appID: d
        });
        return
    }
    if (Emulator.apps[d] === undefined) c.call(this, arguments);
    else {
        var h = Emulator.getAppUrl(d);
        Emulator.appIsLocked(d) || Emulator.PubSub.notify(GM_CONFIG.Events.CREATE_APP, {
            id: e,
            src: h
        })
    }
    b.call(this, arguments)
},
AppController.prototype.deleteApp = function(a) {
    var b = a.success,
    c = a.failure,
    d = a.appID,
    e = a.options;
    if (typeof Emulator.apps[d] == "undefined") {
        c(GM_CONFIG.FailureCodes.APP_NOT_FOUND);
        return
    }
    if (Emulator.isAppRunning(d) === !0) {
        c(GM_CONFIG.FailureCodes.APP_RUNNING);
        return
    }
    Emulator.apps[d].remove(),
    Emulator.homeScreenController.view.render(Emulator.apps),
    b()
},
AppController.prototype.updateAppState = function(a) {
    var b = a.appID,
    c = null;
    if (b == Emulator.HOME_SCREEN_ID) return;
    b == Emulator.getVisibleAppID() ? Emulator.appIsLocked(b) ? c = GM_CONFIG.AppStates.AS_FOREGROUND_LOCKED: c = GM_CONFIG.AppStates.AS_FOREGROUND: Emulator.isAppRunning(b) ? Emulator.appIsLocked(b) ? c = GM_CONFIG.AppStates.AS_BACKGROUND_LOCKED: c = GM_CONFIG.AppStates.AS_BACKGROUND: Emulator.appIsLocked(b) ? c = GM_CONFIG.AppStates.AS_DISABLED: c = GM_CONFIG.AppStates.AS_NOT_ACTIVE,
    Emulator.apps[b].set("state", c)
},
AppController.prototype.changeIcon = function(a) {
    var b = a.filename,
    c = a.appID,
    d = a.failure;
    if (typeof Emulator.apps[c] == "undefined") {
        d(GM_CONFIG.FailureCodes.APP_NOT_FOUND);
        return
    }
    Emulator.apps[c].config.IconURL = b,
    Emulator.homeScreenController.view.render(Emulator.apps)
},
AppController.prototype.ChangeFriendlyName = function(a) {
    var b = a.appID,
    c = a.name,
    d = a.failure;
    if (typeof Emulator.apps[b] == "undefined") {
        d(GM_CONFIG.FailureCodes.APP_NOT_FOUND);
        return
    }
    Emulator.apps[b].config.FriendlyName = c,
    Emulator.homeScreenController.view.render(Emulator.apps)
},
define("controller/app-controller", 
function() {}),
Util.extend(MenuPanelView, BaseView),
MenuPanelView.prototype.getGearButtons = function() {
    return {
        park: {
            status: GM_CONFIG.DRIVE_STATES.PARK,
            selector: "#park.mode"
        },
        lowspeed: {
            status: GM_CONFIG.DRIVE_STATES.LOWSPEED,
            selector: "#lowspeed.mode"
        },
        highspeed: {
            status: GM_CONFIG.DRIVE_STATES.HIGHSPEED,
            selector: "#highspeed.mode"
        },
        drive: {
            status: GM_CONFIG.DRIVE_STATES.DRIVE,
            selector: "#drive.mode"
        },
        reverse: {
            status: GM_CONFIG.DRIVE_STATES.REVERSE,
            selector: "#reverse.mode"
        },
        neutral: {
            status: GM_CONFIG.DRIVE_STATES.NEUTRAL,
            selector: "#neutral.mode"
        }
    }
},
MenuPanelView.prototype.setProximityState = function(a) {
    var b = x$("#proximity-toggle");
    a ? (b.removeClass("off"), b.addClass("on")) : (b.removeClass("on"), b.addClass("off"))
},
MenuPanelView.prototype.setIgnitionState = function(a) {
    var b = x$("body");
    a === "on" ? (b.removeClass("ignition-pending"), b.removeClass("ignition-off")) : a === "pending" ? b.addClass("ignition-pending") : (b.removeClass("ignition-pending"), b.addClass("ignition-off"))
},
MenuPanelView.prototype.setGearState = function(a) {
    var b = this.getGearButtons(),
    c,
    d,
    e;
    for (c in b) e = b[c],
    d = x$(e.selector),
    a === e.status ? d.removeClass("off").addClass("on") : d.removeClass("on").addClass("off")
},
define("view/menu-panel-view", 
function() {}),
Util.extend(VehicleConfigurationSettingView, BaseView),
VehicleConfigurationSettingView.prototype.initField = function(a) {
    this.addObserver("#" + a, "change", Util.bind(this, this.onFieldChanged), {
        key: a
    }),
    this.addObserver(Emulator.getValueRef(a), "onChange", Util.bind(this, this.onValueChanged), {
        target: "#" + a
    })
},
VehicleConfigurationSettingView.prototype.onFieldChanged = function(a, b) {
    if (b.key == "buttonsAvailable") {
        var c = Emulator.getValue("buttonsAvailable");
        c[a.event.target.value] = a.event.target.checked,
        Emulator.setValue("buttonsAvailable", c)
    } else Util.setModelFromFieldValue(a, b)
},
VehicleConfigurationSettingView.prototype.onValueChanged = function(a, b) {
    if (b.target == "#buttonsAvailable") {
        var c = a.value;
        x$("#buttonsAvailable input").each(function() {
            var a = this;
            a.checked = c[a.value]
        })
    } else Util.changeValue(a, b)
},
VehicleConfigurationSettingView.prototype.renderLanguages = function(a) {
    var b = "";
    for (var c in a) b += '<option value="' + c + '">' + a[c].display + "</option>";
    x$("#Vehicle_Config #language").html(b)
},
define("view/settings/vehicle-configuration-view", 
function() {}),
Util.extend(VehicleDataSettingView, BaseView),
VehicleDataSettingView.prototype.setSliderValue = function(a, b) {
    var c = x$("#" + a),
    d = x$("#" + a.replace("_slider", ""));
    c[0].value = b,
    d[0].value = b;
    var e = x$(x$("#" + a)[0].parentNode).find(".alt-units-psi");
    if (e.length) {
        var f = Util.kpagToPsi(b, 2);
        e.inner(f)
    }
    var g = x$(x$("#" + a)[0].parentNode).find(".alt-units-miles");
    if (g.length) {
        var h = Util.kmToMiles(b, 2);
        g.inner(h)
    }
    var i = x$(x$("#" + a)[0].parentNode).find(".alt-units-feet");
    if (i.length) {
        var j = Util.cmToFeet(b, 2);
        i.inner(j)
    }
},
VehicleDataSettingView.prototype.renderConfig = function(a, b) {
    var c = "",
    d = 0,
    e = null,
    f = 0,
    g = null,
    h = null,
    i = null,
    j = null,
    k = !1;
    for (var l in b) {
        if (l == "Default_Table_List") continue;
        c += '<div class="setting-group">',
        l == "DTC_Table_Entry" && (k = !0, c += '<div id="DTC_Section">', d = 0),
        c += '<div class="title" id="' + l + '">' + l + "</div>";
        for (var m in b[l]) {
            g = m + "_" + d,
            h = "add_" + d,
            i = "remove_" + d,
            j = "save_" + d;
            if (m == "disable") continue;
            var n = b[l][m];
            c += '<div class="field">',
            c += '<div class="label"><span>' + m + ":</span></div>",
            c += '<div class="value">';
            if (n.slider) c += '<input type="range" min="' + n.slider.from + '" ' + 'class="vehicle_data_model ' + m + '"' + 'max="' + Math.round(n.slider.to) + '" value="' + Math.round(n.slider.from) + '" ' + 'id="' + m + '_slider"' + (l == "Date_and_Time_LS" ? ' disabled="true"': "") + ">",
            c += '<input id="' + m + '" class="value_display vehicle_data_model ' + m + '" type="text" value="' + n.slider.from + '" />',
            n.slider.units !== undefined && (c += '<span class="units">' + n.slider.units + "</span>", n.slider.units.toLowerCase() == "kpag" && (c += '<br/>(<span class="alt-units-psi">xxx</span>) psi'), n.slider.units.toLowerCase() == "km" && (c += '<br/>(<span class="alt-units-miles">xxx</span>) miles'), n.slider.units.toLowerCase() == "cm" && (c += '<br/>(<span class="alt-units-feet">xxx</span>) feet'));
            else if (n.select) {
                l !== "DTC_Table_Entry" && (g = m),
                c += '<select id="' + g + '" class="vehicle_data_model ' + m + '">';
                for (var o in n.select) c += '<option value="' + o + '">' + n.select[o] + "</option>";
                c += "</select>"
            } else if (n.text) {
                m == "tableID" ? (c += '<input value="' + f + '" id="' + g + '" type="text" readonly="readonly" class="vehicle_data_model ' + m + '"', f++) : m == "lastFaultDate" || m == "previousFaultDate" ? c += '<input id="' + g + '" type="text" class="vehicle_data_model ' + m + '"': c += '<input id="' + m + '" type="text" class="vehicle_data_model ' + m + '"';
                for (var p in n.text.attributes) c += " " + p + '="' + n.text.attributes[p] + '"';
                n.text.help && (c += '<input id="' + g + '" type="text" class="vehicle_data_model ' + m + '"', c += "<p>(e.g:mm/dd/yyyy)</p>")
            }
            c += '<span class="field-error"></span>',
            c += "</div>",
            c += "</div>"
        }
        d++,
        k && (k = !1, c += '<div style="height:25px;margin-right:20px;"><button id="' + h + '" class="new_table">Add Table</button></div>', c += '<div style="height:25px;margin-right:20px;"><button id="' + j + '" class="save_table">Save Table</button></div>');
        if (b[l].disable !== undefined) {
            var q = b[l].disable;
            c += '<div class="disable-group hide ' + q["class"] + '"><div>' + q.message + "</div></div>"
        }
        c += "</div>"
    }
    x$(a).inner(c),
    x$("#" + h).on("click", Util.bind(this, this.addTable)),
    x$("#" + i).on("click", Util.bind(this, this.removeTable)),
    x$("#" + j).on("click", Util.bind(this, this.saveTable))
},
VehicleDataSettingView.prototype.renderDTCTable = function(a, b, c) {
    var d = "",
    e = null,
    f = 0,
    g = null,
    h = null,
    i = null,
    j = null,
    k = null;
    for (var l in b) {
        d += '<div class="setting-group">',
        d += '<div class="title" id="' + l + '">Add Table</div>',
        k = b[l];
        for (var m in c) {
            j = m + "_" + f,
            g = "add_" + f,
            h = "save_" + f,
            i = "remove_" + f;
            if (m == "disable") continue;
            var n = c[m];
            d += '<div class="field">',
            d += '<div class="label"><span>' + m + ":</span></div>",
            d += '<div class="value">';
            if (n.slider) d += '<input type="range" min="' + n.slider.from + '" ' + 'class="vehicle_data_model ' + m + '"' + 'max="' + Math.round(n.slider.to) + '" value="' + Math.round(n.slider.from) + '" ' + 'id="' + m + '_slider"' + (l == "Date_and_Time_LS" ? ' disabled="true"': "") + ">",
            d += '<input id="' + m + '" class="value_display vehicle_data_model ' + m + '" type="text" value="' + n.slider.from + '" />',
            n.slider.units !== undefined && (d += '<span class="units">' + n.slider.units + "</span>", n.slider.units.toLowerCase() == "kpag" && (d += '<br/>(<span class="alt-units-psi">xxx</span>) psi'), n.slider.units.toLowerCase() == "km" && (d += '<br/>(<span class="alt-units-miles">xxx</span>) miles'), n.slider.units.toLowerCase() == "cm" && (d += '<br/>(<span class="alt-units-feet">xxx</span>) feet'));
            else if (n.select) {
                d += '<select id="' + j + '" class="vehicle_data_model ' + m + '">';
                for (var o in n.select) o == k[m] ? d += '<option selected value="' + o + '">' + n.select[o] + "</option>": d += '<option value="' + o + '">' + n.select[o] + "</option>";
                d += "</select>"
            } else if (n.text) {
                m == "tableID" ? d += '<input value="' + b[l].tableID + '" id="' + m + "_" + b[l].tableID + '" type="text" readonly="readonly" class="vehicle_data_model ' + m + '"': d += '<input value = "' + k[m] + '" id="' + j + '" type="text" class="vehicle_data_model ' + m + '"';
                for (var p in n.text.attributes) d += " " + p + '="' + n.text.attributes[p] + '"';
                n.text.help && (d += '<input value = "' + k[m] + '" id="' + j + '" type="text" class="vehicle_data_model ' + m + '"', d += "<p>(e.g:mm/dd/yyyy)</p>")
            }
            d += '<span class="field-error"></span>',
            d += "</div>",
            d += "</div>"
        }
        i != "remove_0" && (d += '<div style="height:25px;margin-right:20px;"><button id="remove_' + b[l].tableID + '" class="remove_table">Remove Table</button></div>'),
        f++,
        d += '<div style="height:25px;margin-right:20px;"><button id="' + g + '" class="new_table">Add Table</button></div>',
        d += '<div style="height:25px;margin-right:20px;"><button id="' + h + '" class="save_table">Save Table</button></div>',
        d += "</div>"
    }
    x$(a).inner(d),
    x$("#" + g).on("click", Util.bind(this, this.addTable)),
    x$("#" + h).on("click", Util.bind(this, this.saveTable));
    for (var l in b) x$("#remove_" + b[l].tableID).on("click", Util.bind(this, this.removeTable))
},
VehicleDataSettingView.prototype.addTable = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry),
    c = null,
    d = null;
    b.length > 0 ? (d = parseInt(a.target.id.split("_")[1]), c = this.validateTable(d)) : c = GM_CONFIG.VehicleData.Default_Table_List,
    c && this.onAddTableClick.fire(c)
},
VehicleDataSettingView.prototype.removeTable = function(a) {
    var b = parseInt(a.target.id.split("_")[1]);
    this.onRemoveTableClick.fire(b)
},
VehicleDataSettingView.prototype.saveTable = function(a) {
    var b = parseInt(a.target.id.split("_")[1]),
    c = this.validateTable(b);
    c && this.onSaveTableClick.fire(c)
},
VehicleDataSettingView.prototype.validateTable = function(a) {
    var b = 0;
    typeof x$("#tableID_" + a)[0] != "undefined" ? b = x$("#tableID_" + a)[0].value: b = 0;
    var c = {
        tableID: b
    };
    x$(this.container).find(".field-error").css({
        display: ""
    });
    var d = function(b, c) {
        var d = x$(this.container).find("#" + b + "_" + a + " ~ .field-error");
        d.inner("Invalid " + c),
        d.css({
            display: "block"
        })
    };
    for (var e in GM_CONFIG.VehicleData.DTC_Table_Entry) {
        if (e == "tableID") continue;
        c[e] = x$("#" + e + "_" + a)[0].value,
        c[e] === "true" ? c[e] = !0: c[e] === "false" ? c[e] = !1: !isNaN(c[e]) && c[e] != "" && (c[e] = parseInt(c[e]))
    }
    return c.tableID == "" ? (d("tableID", "tableID"), null) : c
},
define("view/settings/vehicle-data-view", 
function() {}),
Util.extend(RadioSettingView, BaseView),
define("view/settings/radio-view", 
function() {}),
Util.extend(NetworkSettingView, BaseView),
NetworkSettingView.prototype.render = function(a, b) {
    function e(a, b, c, d) {
        var e = "",
        f = a + "_" + (d == null ? "new": d);
        e += '<div class="field"><div class="label"><span>' + b[a].description + ":</span></div>" + '<div class="value">';
        if (b[a].text) e += '<input id="' + f + '" type="text" class="network_model ' + a + '" value="' + (c || "") + '"/>';
        else if (b[a].select) {
            e += '<select id="' + f + '" class="network_model ' + a + '">';
            for (var g = 0; g < b[a].select.length; g++) {
                var h = b[a].select[g];
                e += "<option value=" + h + " " + (h == c ? "selected": "") + ">" + h + "</option>"
            }
            e += "</select>"
        }
        return e += '<span class="field-error"></span></div></div>',
        e
    }
    var c = "",
    d = 0;
    for (var f in a) {
        c += '<div class="setting-group">',
        c += '<div class="title">Device</div>';
        for (var g in a[f]) g != "id" && (c += e(g, b, a[f][g], a[f].id));
        c += '<div style="height:25px;margin-right:20px;"><button id="remove_' + a[f].id + '" class="remove_device">Remove device</button>' + '<button id="save_' + a[f].id + '" class="save_device">Save changes</button>' + "</div>",
        c += "</div>",
        d++
    }
    c += '<div class="setting-group">',
    c += '    <div class="title">Add device</div>';
    for (var g in b) g != "id" && (c += e(g, b, null, null));
    c += '<div style="height:25px;margin-right:20px;"><button class="new_device">Add device</button></div>',
    c += "</div>",
    x$(this.container).inner(c),
    x$(".deviceAddress").after("<button>Generate</button>"),
    x$(".deviceAddress + button").on("click", 
    function(a) {
        x$(a.target.parentNode).find("input")[0].value = Emulator.generateMACAddress()
    }),
    x$(".new_device").on("click", Util.bind(this, this.addDevice)),
    x$(".remove_device").on("click", Util.bind(this, this.removeDevice)),
    x$(".save_device").on("click", Util.bind(this, this.saveDevice))
},
NetworkSettingView.prototype.addDevice = function() {
    var a = this.validateDevice("new");
    a && this.onAddDeviceClick.fire(a)
},
NetworkSettingView.prototype.removeDevice = function(a) {
    var b = parseInt(a.target.id.split("_")[1]);
    this.onRemoveDeviceClick.fire(b)
},
NetworkSettingView.prototype.saveDevice = function(a) {
    var b = parseInt(a.target.id.split("_")[1]),
    c = this.validateDevice(b);
    c && this.onSaveDeviceClick.fire(c)
},
NetworkSettingView.prototype.validateDevice = function(a) {
    var b = {
        id: parseInt(a)
    };
    x$(this.container).find(".field-error").css({
        display: ""
    });
    var c = function(b, c) {
        var d = x$(this.container).find("#" + b + "_" + a + " ~ .field-error");
        d.inner("Invalid " + c),
        d.css({
            display: "block"
        })
    };
    for (var d in GM_CONFIG.NETWORK_MANAGER.Device_Schema) {
        if (d == "id") continue;
        b[d] = x$("#" + d + "_" + a)[0].value,
        b[d] === "true" ? b[d] = !0: b[d] === "false" ? b[d] = !1: !isNaN(b[d]) && b[d] != "" && (b[d] = parseInt(b[d]))
    }
    return b.friendlyName == "" ? (c("friendlyName", "Friendly Name"), null) : b.deviceAddress.match(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/) ? b: (c("deviceAddress", "Device Address"), null)
},
define("view/settings/network-view", 
function() {}),
Util.extend(BluetoothSettingView, BaseView),
BluetoothSettingView.prototype.render = function(a, b) {
    var c = "",
    d = 0;
    for (var e in a) {
        c += '<div class="setting-group">',
        c += '<div class="title" id="service_' + e + '">Service</div>';
        for (var f in a[e]) c += '<div class="field">',
        c += '<div class="label"><span>' + b[f].description + ":</span></div>",
        c += '<div class="value">',
        c += '<input disabled="true" id="' + f + '" type="text" class="bluetooth_model" value="' + a[e][f] + '"/>',
        c += '<span class="field-error"></span></div></div>';
        c += '<div style="height:25px;margin-right:20px;"><button id="service_' + d + '" class="remove_service" style="float:right;">Remove service</button></div>',
        c += "</div>",
        d++
    }
    c += '<div class="setting-group">',
    c += '    <div class="title">Add service</div>';
    for (var f in b) {
        c += '    <div class="field"><div class="label"><span>' + b[f].description + ":</span></div>",
        c += '    <div class="value">';
        if (b[f].text) c += '<input id="' + f + '_new" type="text" class="bluetooth_model" value=""/>';
        else if (b[f].select) {
            c += '<select id="' + f + '_new" class="bluetooth_model">';
            for (var d = 0; d < b[f].select.length; d++) {
                var g = b[f].select[d];
                c += "<option value=" + g + ">" + g + "</option>"
            }
            c += "</select>"
        }
        c += '<span class="field-error"></span></div></div>'
    }
    c += '<div style="height:25px;margin-right:20px;"><button class="service_new" style="float:right;">Add service</button></div>',
    c += "</div>",
    x$(this.container).inner(c),
    x$(".service_new").on("click", Util.bind(this, this.addService)),
    x$(".remove_service").on("click", Util.bind(this, this.removeService))
},
BluetoothSettingView.prototype.addService = function() {
    var a = {};
    x$(this.container).find(".field-error").css({
        display: ""
    });
    var b = function(a, b) {
        var c = x$(this.container).find("#" + a + "_new ~ .field-error");
        c.inner("Invalid " + b),
        c.css({
            display: "block"
        })
    };
    for (var c in GM_CONFIG.BT_SERVICES.Schema) a[c] = x$("#" + c + "_new")[0].value,
    a[c] === "true" ? a[c] = !0: a[c] === "false" ? a[c] = !1: !isNaN(a[c]) && a[c] != "" && (a[c] = parseInt(a[c]));
    if (a.serviceName == "") {
        b("serviceName", "Service Name");
        return
    }
    if (a.serviceName == "") {
        b("uuid", "Service UUID");
        return
    }
    this.onAddServiceClick.fire(a)
},
BluetoothSettingView.prototype.removeService = function(a) {
    var b = a.target.id.split("_")[1];
    this.onRemoveServiceClick.fire(b)
},
define("view/settings/bluetooth-view", 
function() {}),
Util.extend(GeneralSettingsView, BaseView),
GeneralSettingsView.prototype.updateField = function(a, b) {
    x$("#" + b.key)[0].value = a.value
},
GeneralSettingsView.prototype.onProtocolChanged = function(a, b) {
    Util.setModelFromFieldValue(a, b)
},
GeneralSettingsView.prototype.cleanse = function(a) {
    if (a.event.target.id == "username") {
        var b = a.event.target.value,
        c = b.replace(/\s|\\|\//g, "");
        return c == "" ? (a.xContext.find("#username + .field-error").inner("invalid username: '" + b + "'").css({
            display: "inherit"
        }), Emulator.getValue(GM_CONFIG.ModelKeys.Username)) : (a.xContext.find("#username + .field-error").inner("").css({
            display: "none"
        }), c)
    }
    if (a.event.target.id == "userpin") {
        var b = a.event.target.value,
        c = b.replace(/\s|\\|\//g, "");
        return c == "" ? Emulator.getValue(GM_CONFIG.ModelKeys.UserPin) : c
    }
    if (a.event.target.id == "useremail") {
        var b = a.event.target.value,
        c = b.replace(/\s|\\|\//g, "");
        return c == "" ? Emulator.getValue(GM_CONFIG.ModelKeys.UserEmail) : c
    }
    if (a.event.target.id == "iap_auth") {
        var b = a.event.target.value,
        c = b.replace(/\s|\\|\//g, "");
        return c == "" ? Emulator.getValue(GM_CONFIG.ModelKeys.Communication.IAPAuth) : c
    }
    if (a.event.target.id == "base_server_url") {
        var b = a.event.target.value,
        c = b.replace(/\s|\\|\//g, "");
        return c == "" ? Emulator.getValue(GM_CONFIG.ModelKeys.Communication.BaseServerURL) : c
    }
    return ""
},
define("view/settings/general-settings-view", 
function() {}),
Util.extend(RotaryPanelView, BaseView),
define("view/rc-panel-view", 
function() {}),
Util.extend(SoftButtonsPanelView, BaseView),
define("view/soft-buttons-panel-view", 
function() {}),
Util.extend(SteeringWheelPanelView, BaseView),
SteeringWheelPanelView.prototype.renderVolumeIndicator = function(a) {
    var b = a.volume;
    this.timer && (clearTimeout(this.timer), this.endTransition(), this.timer = null),
    this.xVol.removeClass("hide"),
    b = Math.round(b * 10) / 10,
    this.xVol.find(".fg").css({
        width: b * 100 + "%"
    }),
    this.timer = setTimeout(Util.bind(this, 
    function() {
        this.xVol.css({
            "-webkit-transition": "opacity 1s linear"
        }),
        this.xVol.css({
            opacity: "0"
        }),
        this.timer = null
    }), 1e3)
},
SteeringWheelPanelView.prototype.endTransition = function() {
    this.xVol.css({
        "-webkit-transition": ""
    }),
    this.xVol.css({
        opacity: "1"
    })
},
define("view/swc-panel-view", 
function() {}),
Util.extend(NavigationPanelView, BaseView),
NavigationPanelView.prototype.showError = function(a) {
    x$("#load_route_prompt").removeClass("hide"),
    x$("#load_route_prompt").find(".prompt-label").inner(a)
},
define("view/navigation-panel-view", 
function() {}),
Util.extend(HomeScreenView, BaseView),
HomeScreenView.prototype.render = function(a) {
    var b = "",
    c = this.getOrderedIDArray(a);
    for (var d = 0; d < c.length; d++) {
        app = parseInt(c[d]);
        var e = "appicon" + (a[app].config.background ? " background": "");
        Emulator.isAppRunning(app) && (e += " running"),
        b += "<div id='icon-" + Emulator.getAppString(app) + "' class='" + e + "'>",
        b += "<img src='" + this.getAppIconUrl(app) + "' class='icon' />",
        b += "<img src='style/img/app_running.gif' class='spinner'/>",
        b += "<div class='app-name'>" + a[app].config.FriendlyName + "</div>",
        b += "</div>"
    }
    var f = x$("#application_launcher");
    f.html(b);
    var g = this;
    f.find(".appicon").on("click", 
    function(a) {
        var b = this.id.split("-")[1],
        c = Emulator.getAppIDFromString(b);
        g.onAppIconClick.fire(c, this)
    })
},
HomeScreenView.prototype.lockApp = function(a) {
    x$("#icon-" + Emulator.getAppString(a)).addClass("locked"),
    Emulator.apps[a].locked = !0;
    var b = Emulator.getAppFrame(a);
    if (b && !b.hasClass("locked")) {
        b.addClass("locked");
        var c = document.getElementById(Emulator.getAppString(a));
        if (c != undefined) {
            var d = c.contentWindow.document,
            e = d.createElement("div");
            e.setAttribute("id", GM_CONFIG.BlockEventId);
            var f = d.getElementsByTagName("body")[0];
            f.appendChild(e);
            var g = d.getElementById(GM_CONFIG.BlockEventId);
            g.style.position = "absolute",
            g.style.left = "0px",
            g.style.top = "0px",
            g.style["z-index"] = "100000",
            g.style.width = f.clientWidth,
            g.style.height = f.clientHeight
        }
        Emulator.PubSub.notify(GM_CONFIG.Events.APP_STATE_CHANGE, {
            appID: a
        })
    }
},
HomeScreenView.prototype.unlockApp = function(appID) {
    x$("#icon-" + Emulator.getAppString(appID)).removeClass("locked"),
    Emulator.apps[appID].locked = !1;
    var xApplicationIframe = Emulator.getAppFrame(appID);
    if (xApplicationIframe && xApplicationIframe.hasClass("locked")) {
        xApplicationIframe.removeClass("locked");
        var appNS = eval(Emulator.getAppString(appID)),
        appBody = appNS.document.getElementsByTagName("body")[0],
        blockDiv = appNS.document.getElementById(GM_CONFIG.BlockEventId);
        appBody.removeChild(blockDiv),
        Emulator.PubSub.notify(GM_CONFIG.Events.APP_STATE_CHANGE, {
            appID: appID
        })
    }
},
HomeScreenView.prototype.getAppIconUrl = function(a) {
    var b,
    c = Emulator.apps[a].config;
    if (typeof c.SourceLocation == "string" && c.SourceLocation.toLowerCase() == "remote") {
        var d = c.RemotePath;
        b = d + (d.charAt(d.length - 1) == "/" ? "": "/") + c.IconURL
    } else b = Emulator.apps[a].folder + c.IconURL;
    return b
},
HomeScreenView.prototype.getOrderedIDArray = function(a) {
    var b = [];
    for (app in a) app != GM_CONFIG.SYSTEM_APP_ID && b.push(app);
    for (var c = 0; c < b.length; c++) {
        var d = b[c],
        e = a[d].position;
        if (e >= 0) {
            e >= b.length && (e = b.length - 1, a[d].position = e);
            var f = b[e];
            b[e] = b[c],
            b[c] = f
        }
    }
    return b
},
define("view/home-screen-view", 
function() {}),
Util.extend(TimePanelView, BaseView),
TimePanelView.prototype.setClockInterval = function(a) {
    this.clockInterval = setInterval(function() {
        Emulator.incrementTime();
        var a = Emulator.Vehicle.CurrentTime,
        b = x$("#date"),
        c = x$("#time"),
        d = x$("#app_window_time_value");
        b.inner(a.toDateString()),
        c.inner(a.toTimeString().substring(0, 8)),
        d.inner(a.toTimeString().substring(0, 5))
    },
    500 / a)
},
TimePanelView.prototype.isSettingsClosed = function() {
    return x$("#settings_overlay")[0].offsetLeft < 0
},
TimePanelView.prototype.updateTimeMultiplier = function(a) {
    var b = x$(".speed-selector")[0];
    if (parseFloat(b.options[b.selectedIndex].value) !== a) {
        var c = 0,
        d = b.childNodes,
        e = d.length,
        f;
        for (; c < e; c++) f = d[c],
        parseFloat(f.value) === a ? f.selected = !0: f.selected = !1
    }
},
define("view/time-panel-view", 
function() {}),
Util.extend(NativeAppView, BaseView),
NativeAppView.prototype.showNativeApp = function(a) {
    if (a.target == "show_alert" && !x$("#show_alert").hasClass("hide")) {
        this.alertQueue.push(a);
        return
    }
    this.setDimensions(),
    this.renderContents(a),
    x$("#" + a.target).removeClass("hide"),
    x$("#native_application_windows").removeClass("hide"),
    a.target == "video_container" && x$("#video_container").addClass("loading")
},
NativeAppView.prototype.hideNativeApp = function(a) {
    a ? x$("#" + a).addClass("hide") : x$("#native_application_windows .native-window").addClass("hide"),
    x$("#native_application_windows").addClass("hide"),
    this.alertQueue.length > 0 && this.showNativeApp(this.alertQueue.shift())
},
NativeAppView.prototype.setDimensions = function() {
    var a = x$("#screen_container"),
    b = a[0].clientWidth,
    c = a.find(".iframe.active"),
    d = c[0].clientWidth,
    e = a[0].clientHeight,
    f = c[0].clientHeight
},
NativeAppView.prototype.renderContents = function(a) {
    var b = x$("#" + a.target);
    if (b.length == 0) return;
    for (var c in a.attributes) {
        var d = b.find("." + c);
        d.length > 0 && d.html(a.attributes[c])
    }
},
define("view/native-app-view", 
function() {}),
Util.extend(DebugPanelView, BaseView),
define("view/debug-panel-view", 
function() {}),
Util.extend(InteractionSelectorView, BaseView),
InteractionSelectorView.prototype.render = function(a, b) {
    var c = function(a) {
        return a.substring(a.indexOf("_") + 1)
    },
    d = x$("#is_" + a);
    d.length > 0 && d.html("remove");
    if (b == null || b.length == 0) return;
    var e = document.createElement("div");
    e.setAttribute("id", "is_" + a),
    e.setAttribute("class", "interaction-selector");
    var f = "";
    for (var g = 0; g < b.length; g++) b[g].type == "icon" ? (b[g].icon = Emulator.apps[a].folder + b[g].icon, f += "<button id='" + a + "_" + b[g].id + "' style='background-image: url(" + b[g].icon + ")' value=" + g + "></button>") : f += "<button id='" + a + "_" + b[g].id + "' value=" + g + ">" + b[g].text + "</button>";
    e.innerHTML = f,
    this.xContainer[0].appendChild(e);
    var h = x$("#is_" + a),
    i = this;
    h.find("button").each(function() {
        x$(this).on("click", 
        function() {
            i.toggleVisible(this.parentNode),
            b[this.value].onclick(c(this.id))
        })
    })
},
InteractionSelectorView.prototype.toggleVisible = function() {
    var a = x$("#applications iframe.active");
    if (a.length == 0) return;
    var b = Emulator.getAppIDFromString(a[0].id),
    c = x$("#is_" + b);
    if (c.length == 0) return;
    c.hasClass("visible") ? (c.removeClass("visible"), this.xToggle.find(".arrow").removeClass("down"), this.xToggle.find(".arrow").addClass("up")) : (c.addClass("visible"), this.xToggle.find(".arrow").removeClass("up"), this.xToggle.find(".arrow").addClass("down"))
},
InteractionSelectorView.prototype.onCurrentAppChanged = function(a) {
    this.xContainer.find(".interaction-selector").removeClass("visible").addClass("hide"),
    this.xContainer.find("#is_" + a).removeClass("hide")
},
define("view/interaction-selector-view", 
function() {}),
Util.extend(POISearchView, BaseView),
POISearchView.prototype.renderAutocompleteResults = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) b.push(a[c].name);
    x$("#poisearch input").autocomplete(b),
    x$("#poisearch input").on("change", Util.bind(function(a) {
        this.onRequestAutocompleteResults.fire({
            search: a.target.value
        })
    }))
},
POISearchView.prototype.renderSearchResults = function(a) {
    var b = "";
    for (var c in a) for (var d = 0; d < a[c].length; d++) b += "<li>" + a[c][d].name + "</li>";
    x$("#poisearch .search-results").html("inner", b)
},
POISearchView.prototype.showSearchResults = function(a) {
    a ? x$("#poisearch .search-results").removeClass("hide") : x$("#poisearch .search-results").addClass("hide")
};
var autocompletePlugin = {
    autocomplete: function(a) {
        function c(b) {
            var c = "";
            for (var d = 0; d < a.length; d++) a[d].toLowerCase().substring(0, b.length) == b.toLowerCase() && (c += "<option>" + a[d] + "</option>");
            return this.list.inner(c),
            c == "" ? !1: !0
        }
        function d(a) {
            a == 1 ? (this.list.removeClass("hide"), this.list[0].focus()) : (this.list.addClass("hide"), this[0].focus())
        }
        var b = a.length > 4 ? 4: a.length;
        x$(this[0].nextSibling).hasClass("autocomplete") && x$(this[0].nextSibling).html("remove"),
        this.after("<select class='autocomplete hide' size=" + b + "></select>"),
        this.list = x$(this[0].nextSibling),
        this.list.css({
            width: this[0].offsetWidth - 6 + "px"
        }),
        c.call(this, ""),
        this.on("keyup", Util.bind(this, 
        function(a) {
            var b = c.call(this, this[0].value);
            b ? d.call(this, !0) : d.call(this, !1)
        })),
        this.list.on("change", Util.bind(this, 
        function(a) {
            this[0].value = this.list[0].value
        }));
        var e = Util.bind(this, d, [!1]);
        this.list.on("click", e),
        this.list.on("blur", 
        function() {
            e()
        }),
        this.list.on("keyup", 
        function(a) {
            a.keyCode == 13 && e()
        })
    }
};
define("view/poisearch-view", 
function() {}),
Util.extend(PhoneSettingsView, BaseView),
PhoneSettingsView.prototype.showSppData = function(a) {
    x$("#Phone .spp-data").inner(JSON.stringify(a))
},
define("view/settings/phone-view", 
function() {}),
typeof gm == "undefined" && (gm = {}),
typeof gm.constants == "undefined" && (gm.constants = {}),
gm.constants = {
    FALSE: 0,
    TRUE: 1,
    TOGGLE: 3
},
gm.constants.webServiceRequest = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    OPTIONS: "OPTIONS",
    CONNECT: "CONNECT"
},
gm.constants.vehicledata = {
    YAW_RATE: "yaw_rate",
    LONG_ACCEL: "long_accel",
    WHEEL_ANGLE: "wheel_angle",
    LAT_ACCEL: "lat_accel",
    TRACTION_CONTROL_ACTIVE: "traction_control_active",
    TRACTION_CONTROL: "traction_control",
    TRACTION_CONTROL_MODE: "traction_control_mode",
    SHIFT_MODE_STATUS: "shift_mode_status",
    ENGINE_SPEED: "engine_speed",
    THROTTLE_POSITION: "throttle_position",
    ACCELERATOR_POSITION: "accelerator_position",
    SHIFT_LEVER_POSITION: "shift_lever_position",
    CRUISE_CONTROL: "cruise_control",
    GEAR_AUTOMATIC: "gear_automatic",
    RADIATOR_FAN_SPEED: "radiator_fan_speed",
    TOP_SPEED: "top_speed",
    REMOTE_STARTED: "remote_started",
    AC_COMPRESSOR_ON: "ac_compressor_on",
    FUEL_CAPACITY: "fuel_capacity",
    FUEL_FILTER_LIFE: "fuel_filter_life",
    ENGINE_OIL_LIFE: "engine_oil_life",
    RSA_INSTALLED: "rsa_installed",
    TRANSMISSION_OIL_TEMP: "transmission_oil_temp",
    ENGINE_OIL_TEMP: "engine_oil_temp",
    ENGINE_COOLANT_TEMP: "engine_coolant_temp",
    ENGINE_OIL_PRESSURE: "engine_oil_pressure",
    BAROMETRIC_PRESSURE: "barometric_pressure",
    INTAKE_AIR_TEMP: "intake_air_temp",
    TIRE_LEFT_FRONT_PRESSURE: "tire_left_front_pressure",
    TIRE_LEFT_REAR_PRESSURE: "tire_left_rear_pressure",
    TIRE_RIGHT_FRONT_PRESSURE: "tire_right_front_pressure",
    TIRE_RIGHT_REAR_PRESSURE: "tire_right_rear_pressure",
    ODOMETER: "odometer",
    GPS_LAT: "gps_lat",
    GPS_LONG: "gps_long",
    GPS_HEADING: "gps_heading",
    GPS_ELEVATION: "gps_elevation",
    YEAR: "year",
    MONTH: "month",
    DAY: "day",
    HOURS: "hours",
    MINUTES: "minutes",
    SECONDS: "seconds",
    FOLDING_TOP_STATE: "folding_top_state",
    TARGA_TOP_STATE: "targa_top_state",
    OUTSIDE_AIR_TEMP: "outside_air_temp",
    AVERAGE_SPEED: "average_speed",
    DISTANE_COUNTER: "distance_counter",
    VIN_2_9: "vin_2_9",
    VIN_10_17: "vin_10_17",
    LIGHT_LEVEL: "light_level",
    TURN_SIGNAL: "turn_signal",
    HAZARD_SWITCH: "hazard_switch",
    DAYTIME_LIGHTS: "daytime_lights",
    BRAKE_LIGHTS: "brake_lights",
    LIGHTS: "lights",
    HEADLAMP_BEAM: "headlamp_beam",
    CRUISE_DRIVER_ON: "cruise_driver_on",
    CRUISE_ADAPTIVE_ON: "cruise_adaptive_on",
    CRUISE_ADAPTIVE_SPEED: "cruise_adaptive_speed",
    CRUISE_DRIVER_SPEED: "cruise_driver_speed",
    ABS_ACTIVE: "ABS_active",
    BRAKES_OVERHEATED: "brakes_overheated",
    SPARE_TIRE: "spare_tire",
    BATTERY_CHARGE_STATE: "battery_charge_state",
    BATTERY_CHARGE_STATE_OFF: "battery_charge_state_off",
    BRAKE_POSITION: "brake_position",
    TRAILER_WIRING_FAULT: "trailer_wiring_fault",
    TIRE_MONITOR_RESET: "tire_monitor_reset",
    PARK_BRAKE_RELEASE: "park_brake_release",
    ABS_INDICATOR: "ABS_indicator",
    SERVICE_TRAILER_BRAKES: "service_trailer_brakes",
    TRAILER_BRAKES_GAIN: "trailer_brakes_gain",
    FUEL_CONSUMPTION: "fuel_consumption",
    CHARGE_STATE: "charge_state",
    SLIDING_DOOR_LEFT: "sliding_door_left",
    SLIDING_DOOR_RIGHT: "sliding_door_right",
    HYBRID_BATTERY_RANGE: "hybrid_battery_range",
    RADIO_ANIMATION: "radio_animation",
    PASSENGER_DOOR_OPEN: "passenger_door_open",
    REARLEFT_DOOR_OPEN: "rearleft_door_open",
    REARRIGHT_DOOR_OPEN: "rearright_door_open",
    DRIVER_DOOR_OPEN: "driver_door_open",
    PASSENGER_SEATBELT_FASTENED: "passenger_seatbelt_fastened",
    DRIVER_SEATBELT_FASTENED: "driver_seatbelt_fastened",
    PARK_HEAT_ON: "park_heat_on",
    PARK_HEAT_TEMP: "park_heat_temp",
    PARK_HEAT_COUNTER: "park_heat_counter",
    HUD_ANIMATION: "HUD_animation",
    HUD_ON: "HUD_on",
    VALET_ON: "valet_on",
    INFOTAINMENT_AVAILABLE: "infotainment_available",
    TRAILER_FOGLIGHT: "trailer_foglight",
    TRAILER_TAILLIGHT_FAIL: "trailer_taillight_fail",
    TRAILER_FOGLIGHT_FAIL: "trailer_foglight_fail",
    TRAILER_BRAKELGHT_FAIL: "trailer_brakelght_fail",
    TRAILER_HITCH: "trailer_hitch",
    TRAILER_REARRIGHT_FAIL: "trailer_rearright_fail",
    TRAILER_REARLEFT_FAIL: "trailer_rearleft_fail",
    TRAILER_RIGHTTURN_FAIL: "trailer_rightturn_fail",
    TRAILER_LEFTTURN_FAIL: "trailer_leftturn_fail",
    AUTOBEAMS_ON: "autobeams_on",
    CITY_LIGHTS: "city_lights",
    AUTOBEAMS_STATUS: "autobeams_status",
    PARK_ASST_FAIL: "park_asst_fail",
    PARK_ASST_DISABLED: "park_asst_disabled",
    PARK_BRAKE_ON: "park_brake_on",
    WASHER_FLUID_LOW: "washer_fluid_low",
    TPM_FAIL: "TPM_fail",
    WIPERS_ON: "wipers_on",
    DRIVER_WORKLOAD: "driver_worlkload",
    BATTERY_CONDITION_EFF: "battery_condition_eff",
    CABIN_CONDITION_EFF: "cabin_condition_eff",
    STYLE_ENERGY_EFF: "style_energy_eff",
    TOTAL_ENERGY_EFF: "total_energy_eff",
    FUEL_EFF: "fuel_eff",
    FUEL_USED: "fuel_used",
    FUEL_UNITS: "fuel_units",
    IPC_ANIMATION: "IPC_animation",
    REAR_RADAR_FAIL: "rear_radar_fail",
    REAR_RADAR_BLOCKED: "rear_radar_blocked",
    FRONT_RADAR_FAIL: "front_radar_fail",
    FRONT_RADAR_BLOCKED: "front_radar_blocked",
    FRONT_CAMERA_FAIL: "front_camera_fail",
    FRONT_EXTERNAL_OBJECT_CALC_MODULE_FAIL: "front_external_object_calc_module_fail",
    FRONT_CAMERA_BLOCKED: "front_camera_blocked",
    HATCH_OBSTACLE: "hatch_obstacle",
    HATCH_ANGLE: "hatch_angle",
    VEHICLE_INCLINE: "vehicle_incline",
    HATCH_MOTION: "hatch_motion",
    BULB_REARLEFT_TURN_FAIL: "bulb_rearleft_turn_fail",
    BULB_LICENSEPLATE_FAIL: "bulb_licenseplate_fail",
    BULB_LEFT_PARK_FAIL: "bulb_left_park_fail",
    BULB_LEFT_LOW_FAIL: "bulb_left_low_fail",
    BULB_LEFT_BRAKE_FAIL: "bulb_left_brake_fail",
    BULB_FRONTRIGHT_TURN_FAIL: "bulb_frontright_turn_fail",
    BULB_FRONTLEFT_TURN_FAIL: "bulb_frontleft_turn_fail",
    BULB_CENTER_FAIL: "bulb_center_fail",
    BULB_RIGHT_DAYTIME_FAIL: "bulb_right_daytime_fail",
    BULB_LEFT_DAYTIME_FAIL: "bulb_left_daytime_fail",
    BULB_REVERSE_FAIL: "bulb_reverse_fail",
    BULB_REAR_FOG_FAIL: "bulb_rear_fog_fail",
    BULB_RIGHT_PARK_FAIL: "bulb_right_park_fail",
    BULB_RIGHT_LOW_FAIL: "bulb_right_low_fail",
    BULB_RIGHT_BRAKE_FAIL: "bulb_right_brake_fail",
    BULB_REARRIGHT_TURN_FAIL: "bulb_rearright_turn_fail",
    DISPLAY_NIGHT: "display_night",
    DIM_LEVEL: "dim_level",
    DISPLAY_LEVEL: "display_level",
    WINDOW_LEFTREAR: "window_leftrear",
    WINDOW_DRIVER: "window_driver",
    WINDOW_RIGHTREAR: "window_rightrear",
    WINDOW_PASSENGER: "window_passenger",
    HATCH_OPEN: "hatch_open",
    AUX_HEAT_ON: "aux_heat_on",
    AUX_HEAT_TEMP: "aux_heat_temp",
    AV_CHANNEL: "AV_channel",
    AUDIO_SOURCE: "audio_source",
    AUDIO_CHANNEL: "audio_channel",
    STEERINGWHEEL_SIDE: "steeringwheel_side",
    COMPASS_HEADING: "compass_heading",
    HUMID_GLASS_TEMP: "humid_glass_temp",
    HUMID_TEMP: "humid_temp",
    HUMIDITY: "humidity",
    FRONT_FAN_SPEED: "front_fan_speed",
    HOOD: "Hood",
    DISPLAY_UNITS: "Display_units",
    FRONT_LEFT_SET_TEMPERATURE: "front_left_set_temperature",
    FRONT_RIGHT_SET_TEMPERATURE: "front_right_set_temperature",
    CRUISE_SWITCH: "cruise_switch",
    CRUISE_ON: "cruise_on",
    ROAD_CONTROLLED_ACCESS: "road_controlled_access",
    ROAD_SEPARATE_LANE: "road_separate_lane",
    ROAD_BUILD_UP_AREA: "road_build_up_area",
    ROAD_MAP_DATA: "road_map_data",
    ROAD_SPEEDLIMIT_UNITS: "road_speedlimit_units",
    ROAD_LANE_TYPE: "road_lane_type",
    ROAD_SPEED_TYPE: "road_speed_type",
    ROAD_CLASS: "road_class",
    SPEED_LIMIT: "speed_limit",
    SPEED_RECOMMENDED: "speed_recommended",
    CURVE_IND: "curve_ind",
    EV_CHARGE_INTERFERENCE_IND: "EV_charge_interference_ind",
    FUEL_ECONOMY_LIFETIME: "fuel_economy_lifetime",
    BRAKE_FLUID_IND: "brake_fluid_ind",
    ENGINE_OIL_IND: "engine_oil_ind",
    CRUISE_WEATHER_IND: "cruise_weather_ind",
    BRAKE_IND: "brake_ind",
    BRAKE_PAD_IND: "brake_pad_ind",
    SUSPENSION_IND: "suspension_ind",
    TIRE_IND: "tire_ind",
    CRUISE_IND: "cruise_ind",
    REAR_AXLE_IND: "rear_axle_ind",
    FRONT_AXLE_IND: "front_axle_ind",
    SEATBELT_SETTINGS_ON: "seatbelt_settings_on",
    HYBRID_JUMP_START: "hybrid_jump_start",
    HYBRID_DRIVE_MODE: "hybrid_drive_mode",
    HYBRID_USABLE_CHARGE: "hybrid_usable_charge",
    HYBRID_INSTANT_EFF: "hybrid_instant_eff",
    FUEL_FILLER_CAP_IND: "fuel_filler_cap_ind",
    FUEL_WATER_IND: "fuel_water_ind",
    OIL_PRESSURE_IND: "oil_pressure_ind",
    OIL_LEVEL_IND: "oil_level_ind",
    POWERPACK_AIR_IN_TEMP: "powerpack_air_in_temp",
    POWERPACK_FAN_SPEED: "powerpack_fan_speed",
    FUEL_FILTER_IND: "fuel_filter_ind",
    FUEL_LEVEL: "fuel_level",
    ALTERNATIVE_FUEL_MODE: "alternative_fuel_mode",
    ALTERNATIVE_FUEL_LEVEL: "alternative_fuel_level",
    ALTERNATIVE_FUEL_CAPACITY: "alternative_fuel_capacity",
    ALTERNATIVE_FUEL_ALCOHOL: "alternative_fuel_alcohol",
    PASSENGER_PRESENT: "passenger_present",
    AIR_CONDITION_STATUS: "air_condition_status",
    EV_CHARGE_PORT_DOOR: "EV_charge_port_door",
    EV_TODC_TEMPORARY_OVERRIDE_STATUS: "EV_TODC_Temporary_Override_Status",
    EV_TODC_DEPARTURE_DAY: "EV_TODC_departure_day",
    EV_TODC_DEPARTURE_HOUR: "EV_TODC_departure_hour",
    EV_TODC_DEPARTURE_MINUTE: "EV_TODC_departure_minute",
    EV_MAX_RANGE: "EV_max_range",
    EV_MIN_RANGE: "EV_min_range",
    EV_ACTIVE_COOLING: "EV_active_cooling",
    DISTANCE_TRAVELED_BATTERY: "distance_traveled_battery",
    DISTANCE_TRAVELED: "distance_traveled",
    DISTANCE_TRAVELED_FUEL: "distance_traveled_fuel",
    EV_TOD_COMPLETE_HIGH_DAY: "EV_TOD_complete_high_day",
    EV_TOD_COMPLETE_HIGH_HOUR: "EV_TOD_complete_high_hour",
    EV_TOD_COMPLETE_HIGH_MINUTE: "EV_TOD_complete_high_minute",
    EV_TOD_COMPLETE_LOW_DAY: "EV_TOD_complete_low_day",
    EV_TOD_COMPLETE_LOW_HOUR: "EV_TOD_complete_low_hour",
    EV_TOD_COMPLETE_LOW_MINUTE: "EV_TOD_complete_low_minute",
    EV_TOD_START_HIGH_DAY: "EV_TOD_start_high_day",
    EV_TOD_START_HIGH_HOUR: "EV_TOD_start_high_hour",
    EV_TOD_START_HIGH_MINUTE: "EV_TOD_start_high_minute",
    EV_TOD_START_LOW_DAY: "EV_TOD_start_low_day",
    EV_TOD_START_LOW_HOUR: "EV_TOD_start_low_hour",
    EV_TOD_START_LOW_MINUTE: "EV_TOD_start_low_minute",
    EV_CORD_ALERT: "EV_cord_alert",
    EV_NEED_MORE_CHARGE_TIME_IND: "EV_need_more_charge_time_ind",
    EV_DELAY_HOUR: "EV_delay_hour",
    EV_DELAY_DAY: "EV_delay_day",
    EV_DELAY_DEPARTURE_SELECT: "EV_delay_departure_select",
    EV_DELAY_SEASON: "EV_delay_season",
    EV_DELAY_MINUTE: "EV_delay_minute",
    EV_RATE_SEASON: "EV_rate_season",
    EV_RATE_MINUTE: "EV_rate_minute",
    EV_RATE_STATUS: "EV_rate_status",
    EV_RATE_SELECT: "EV_rate_select",
    EV_RATE_HOUR: "EV_rate_hour",
    EV_RATE_DAY: "EV_rate_day",
    EV_RATE_TABLE_VAL: "EV_rate_table_val",
    EV_TIME_RESPONSE: "EV_time_response",
    EV_TIME_SEASON: "EV_time_season",
    EV_TIME_SEASON_SELECT: "EV_time_season_select",
    EV_TIME_MONTH: "EV_time_month",
    EV_TIME_DAY_OF_MONTH: "EV_time_day_of_month",
    EV_TIME_ENABLED: "EV_time_enabled",
    EV_CHARGING_STATUS: "EV_charging_status",
    EV_TIME_RATE: "EV_time_rate"
},
gm.constants.vehicleConfiguration = {
    I_Touch: 0,
    I_Rotary: 1
},
gm.constants.speed = {
    PARK: 0,
    LOW_SPEED: 1,
    HIGH_SPEED: 2
},
gm.constants.version = {
    RADIO: "radio",
    CLUSTER: "cluster",
    ONSTAR: "onstar"
},
gm.constants.destination = {
    ALABAMA: "AL",
    ALASKA: "AK",
    ARIZONA: "AZ",
    ARKANSAS: "AR",
    CALIFORNIA: "CA",
    COLORADO: "CO",
    CONNECTICUT: "CT",
    DELAWARE: "DE",
    FLORIDA: "FL",
    GEORGIA: "GA",
    GUAM: "GU",
    HAWAII: "HI",
    IDAHO: "ID",
    ILLINOIS: "IL",
    INDIANA: "IN",
    IOWA: "IA",
    KANSAS: "KS",
    KENTUCKY: "KY",
    LOUISIANA: "LA",
    MAINE: "ME",
    MARYLAND: "MD",
    MASSACHUSETTS: "MA",
    MICHIGAN: "MI",
    MINNESOTA: "MN",
    MISSISSIPPI: "MS",
    MISSOURI: "MO",
    MONTANA: "MT",
    NEBRASKA: "NE",
    NEVADA: "NV",
    NEW_HAMPSHIRE: "NH",
    NEW_JERSEY: "NJ",
    NEW_MEXICO: "NM",
    NEW_YORK: "NY",
    NORTH_CAROLINA: "NC",
    NORTH_DAKOTA: "ND",
    OHIO: "OH",
    OKLAHOMA: "OK",
    OREGON: "OR",
    PENNSYLVANIA: "PA",
    PUERTO_RICO: "PR",
    RHODE_ISLAND: "RI",
    SOUTH_CAROLINA: "SC",
    SOUTH_DAKOTA: "SD",
    TENNESSEE: "TN",
    TEXAS: "TX",
    UTAH: "UT",
    VERMONT: "VT",
    VIRGIN_ISLANDS: "VI",
    VIRGINIA: "VA",
    WASHINGTON: "WA",
    WEST_VIRGINIA: "WV",
    WISCONSIN: "WI",
    WYOMING: "WY"
},
gm.constants.noiseSuppression = {
    STANDARD: 0,
    LOW: 1
},
gm.constants.callSource = {
    BLUETOOTH: 0,
    ONSTAR: 1,
    OPTIMAL: 2
},
gm.constants.radio = {
    AM: 0,
    FM: 1,
    HD: 2,
    XM: 3,
    IR: 4
},
gm.constants.SDARS = {
    UNKNOWN: 0,
    NOT_AUTHORIZED: 1,
    FREE: 2,
    NOT_AVAILABLE: 3,
    AUTHORIZED: 4
},
gm.constants.button = {
    RC_UP: "RC_UP",
    RC_DOWN: "RC_DOWN",
    RC_LEFT: "RC_LEFT",
    RC_RIGHT: "RC_RIGHT",
    RC_CW: "RC_CW",
    RC_CCW: "RC_CCW",
    RC_SELECT: "RC_SELECT",
    SWC_UP: "SWC_UP",
    SWC_DOWN: "SWC_DOWN",
    SWC_LEFT: "SWC_LEFT",
    SWC_RIGHT: "SWC_RIGHT",
    SWC_VOL_UP: "SWC_VOL_UP",
    SWC_VOL_DOWN: "SWC_VOL_DOWN",
    SWC_SELECT: "SWC_SELECT",
    BTN_BACK: "BTN_BACK",
    BTN_INFO: "BTN_INFO",
    BACK_SWITCH: "BACK_SWITCH",
    INFO_SWITCH: "INFO_SWITCH",
    BTN_FAV: "BTN_FAV",
    BTN_PLAY: "BTN_PLAY",
    BTN_PAUSE: "BTN_PAUSE",
    BTN_PREV: "BTN_PREV",
    BTN_NEXT: "BTN_NEXT",
    BTN_1: "BTN_1",
    BTN_2: "BTN_2",
    BTN_3: "BTN_3",
    BTN_4: "BTN_4",
    BTN_5: "BTN_5",
    BTN_6: "BTN_6"
},
gm.constants.interactionSelectorButton = {
    TEXT: 0,
    ICON: 1
},
gm.constants.filesystem = {
    OVERWRITE: 0,
    APPEND: 1,
    FAIL: 2
},
gm.constants.accessType = {
    LOCAL: 0,
    PRIVATE: 1,
    GLOBAL: 2
},
gm.constants.shutDownType = {
    USER: 0,
    BUS: 1,
    SYSTEM: 2
},
gm.constants.language = {
    0: "en-US",
    1: "de-DE",
    2: "it-IT",
    3: "sv-SE",
    4: "fr-FR",
    5: "es-ES",
    6: "nl-NL",
    7: "pt-PT",
    8: "nb-NO",
    9: "fi-FI",
    10: "da-DK",
    11: "el-GR",
    12: "ja-JP",
    13: "ar-SA",
    14: "zh-CN",
    15: "pl-PL",
    16: "tr-TR",
    17: "ko-KR",
    18: "zh-HK",
    19: "en-GB",
    20: "hu-HU",
    21: "cs-CZ",
    22: "sk-SK",
    23: "ru-RU",
    24: "pt-BR",
    25: "th-TH",
    26: "bg-BG",
    27: "ro-RO",
    28: "sl-SI",
    29: "hr-HR",
    30: "uk-UA",
    31: "fr-CA",
    32: "es-US",
    33: "zh-yue"
},
gm.constants.wifiSecurity = {
    OPEN: 0,
    WEP: 1,
    WPA: 2,
    WPA2: 3
},
gm.constants.mediastatus = {
    FAILURE: -1,
    PLAYING: 0,
    TEMPORARILY_PAUSED: 1,
    AUDIO_OFF: 2,
    INVALID_DATA: 3,
    CHANNEL_UNAVAILABLE: 4,
    SOURCE_CHANGED: 5,
    CONNECTING: 6,
    BUFFERING: 7,
    END_OF_FILE: 8,
    JS_PAUSED: 9,
    JS_STOPPED: 10,
    JS_SEEKED: 11
},
gm.constants.mediatype = {
    MUSIC: "MUSIC",
    PODCAST: "PODCAST",
    AUDIOBOOK: "AUDIOBOOK",
    VIDEO: "VIDEO",
    PLAYLIST: "PLAYLIST",
    STREAM: "STREAM",
    SONG: "SONG",
    UNKNOWN: "UNKNOWN"
},
define("gm-constants", 
function() {}),
typeof Emulator == "undefined" && (Emulator = {}),
Emulator.apps = {},
Emulator.HOME_SCREEN_ID = "home",
Emulator.Model = new Model,
Emulator.controllers = {},
Emulator.addController = function(a, b) {
    this.controllers[b] = a
},
Emulator.getValue = function(a) {
    return this.Model.get(a)
},
Emulator.setValue = function(a, b) {
    return this.Model.set(a, b)
},
Emulator.getValueRef = function(a) {
    return this.Model.getRef(a)
},
Emulator.PubSub = new Pubsub,
Emulator.storage = new Lawnchair({
    adaptor: "cookie"
}),
Emulator.setValue(GM_CONFIG.ModelKeys.Time.DoIncrement, !0),
Emulator.incrementTime = function() {
    if (Emulator.getValue(GM_CONFIG.ModelKeys.Time.DoIncrement)) {
        var a = new Date,
        b = a.valueOf(),
        c = Emulator.Vehicle.PreviousTime.valueOf(),
        d = b - c,
        e = Emulator.getValue(GM_CONFIG.ModelKeys.Time.TimeMultiplier);
        Emulator.Vehicle.TimeOffset += d * e,
        Emulator.Vehicle.CurrentTime.setTime(Emulator.Vehicle.InitializationTime.valueOf() + Emulator.Vehicle.TimeOffset),
        Emulator.Vehicle.PreviousTime = a;
        var f = GM_CONFIG.VehicleData.Date_and_Time_LS;
        Emulator.setValue(f.day.model.key, Emulator.Vehicle.CurrentTime.getDate()),
        Emulator.setValue(f.hours.model.key, Emulator.Vehicle.CurrentTime.getHours()),
        Emulator.setValue(f.minutes.model.key, Emulator.Vehicle.CurrentTime.getMinutes()),
        Emulator.setValue(f.month.model.key, (Emulator.Vehicle.CurrentTime.getMonth() + 1).toString(16).toUpperCase()),
        Emulator.setValue(f.seconds.model.key, Emulator.Vehicle.CurrentTime.getSeconds()),
        Emulator.setValue(f.year.model.key, Emulator.Vehicle.CurrentTime.getFullYear())
    }
},
Emulator.Phone = {},
Emulator.Phone.successCallback = null,
Emulator.Phone.failureCallback = null,
Emulator.Text = {},
Emulator.Text.successCallback = null,
Emulator.Text.failureCallback = null,
Emulator.Email = {},
Emulator.Email.successCallback = null,
Emulator.Email.failureCallback = null,
Emulator.Alert = {},
Emulator.Alert.callbackQueue = [],
Emulator.Bluetooth = {
    WATCH_INDEX: 1e4
},
Emulator.Favorites = {},
Emulator.Speech = {
    srSessionHandle: 0,
    srSessionStarted: !1,
    srStopCalled: !1,
    recordingHandle: 1e4
},
Emulator.Speech.RecordingSession = function(a) {
    this.intro = a.intro || null,
    this.silenceDetection = a.silenceDetection || !1,
    this.silenceLength = a.silenceLength || 1e3,
    this.maxRecordingWindow = a.maxRecordingWindow || 1e4,
    this.noiseSuppression = a.noiseSuppression || "Standard"
},
Emulator.Speech.record = function(success, failure, appFolder) {
    var req = new XMLHttpRequest,
    paramString = "silenceDetection=" + Emulator.Speech.recordingSession.silenceDetection + "&silenceLength=" + Emulator.Speech.recordingSession.silenceLength + "&maxRecordingWindow=" + Emulator.Speech.recordingSession.maxRecordingWindow + "&noiseSuppression=" + Emulator.Speech.recordingSession.noiseSuppression,
    url = appFolder + "commands/recordaudio" + (window.location.search == "" ? "?": window.location.search) + paramString,
    method = "get";
    req.onreadystatechange = function() {
        if (req.readyState == 4) if (req.status == 200) {
            var retVal = eval("(" + req.responseText + ")");
            success(retVal.recordingPath)
        } else failure()
    },
    req.open(method, url, !0),
    req.send(null)
},
Emulator.Favorites.ID = 0,
Emulator.Favorites.addFavorite = function(a, b, c) {
    var d = Emulator.getValue(GM_CONFIG.ModelKeys.Favorites) ? Emulator.getValue(GM_CONFIG.ModelKeys.Favorites) : [],
    e = Emulator.Favorites.ID++,
    f = {
        title: a,
        URL: b,
        id: e
    };
    return c >= d.length ? d.push(f) : d.splice(c, 0, f),
    Emulator.setValue(GM_CONFIG.ModelKeys.Favorites, d),
    Emulator.Favorites.renderFavorites(),
    e
},
Emulator.Favorites.removeFavorite = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Favorites);
    for (var c = 0; c < b.length; c++) a == b[c].id && b.splice(c, 1);
    Emulator.setValue(GM_CONFIG.ModelKeys.Favorites, b),
    Emulator.Favorites.renderFavorites()
},
Emulator.Favorites.renderFavorites = function() {
    var a = x$("#Favorites ul");
    a.find("a").un("click", Emulator.Favorites.launchFavorite),
    a.inner("");
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.Favorites) ? Emulator.getValue(GM_CONFIG.ModelKeys.Favorites) : [],
    c = "";
    for (var d in b) c += '<li><a class="favorite-title" href="' + b[d].URL + '">' + b[d].title + "</a>",
    c += '<button class="favorite-remove" onclick="Emulator.Favorites.removeFavorite(\'' + d + "')\">Remove</button></li>";
    b.length == 0 && (c = "There are no favorites saved."),
    a.inner(c),
    a.find("a").on("click", Emulator.Favorites.launchFavorite)
},
Emulator.Favorites.launchFavorite = function(a) {
    a.preventDefault && a.preventDefault(),
    a.stopPropagation && a.stopPropagation();
    var b = a.target.href;
    if (Emulator.Favorites.linkIsApp(b)) {
        var c = Emulator.Favorites.getIDFromLink(b);
        Emulator.PubSub.notify(GM_CONFIG.Events.LAUNCH_APP, {
            success: function() {
                x$("#applications").find("#" + Emulator.getAppString(c))[0].src = b
            },
            failure: function() {},
            appID: c
        })
    } else {
        var d = x$("#applications iframe#browserApp");
        d.length > 0 ? (d[0].src = b, Emulator.PubSub.notify(GM_CONFIG.Events.FOCUS_APP, {
            success: function() {},
            failure: function() {},
            appID: d[0].id
        })) : Emulator.PubSub.notify(GM_CONFIG.Events.CREATE_APP, {
            id: "browserApp",
            src: b
        })
    }
},
Emulator.Favorites.linkIsApp = function(a) {
    var b = !0;
    return a.match(/^http:\/\//) && !a.match(/http:\/\/localhost/) && (b = !1),
    b
},
Emulator.Favorites.getIDFromLink = function(a) {
    for (var b in Emulator.apps) {
        var c = new RegExp("http://localhost/.*/" + Emulator.apps[b].folder, "g");
        if (a.match(c)) return b * 1
    }
    return ! 1
},
Emulator.Vehicle = {},
Emulator.Vehicle.CurrentTime = new Date,
Emulator.Vehicle.InitializationTime = new Date,
Emulator.Vehicle.PreviousTime = Emulator.Vehicle.CurrentTime,
Emulator.Vehicle.TimeOffset = 0,
Emulator.Vehicle.INITIAL_POSITION = {
    coords: {
        latitude: 49.2809316,
        longitude: -123.1065906,
        heading: 0,
        altitude: 0
    },
    timestamp: Emulator.Vehicle.CurrentTime
},
Emulator.Vehicle.subscribeToWatch = function(a, b, c, d) {
    return Emulator.Vehicle.watches[a].subscribe(b, c, d)
},
Emulator.Vehicle.unsubscribeFromWatch = function(a, b) {
    Emulator.Vehicle.watches[a].unsubscribe(b)
},
Emulator.Vehicle.Watch = function() {
    this.guid = 0,
    this.success = {},
    this.failure = {}
},
Emulator.Vehicle.Watch.prototype.subscribe = function(a, b) {
    if (a == null) return;
    var c = a,
    d = b || 
    function() {},
    e = this.guid++;
    return this.success[e] = c,
    this.failure[e] = d,
    e
},
Emulator.Vehicle.Watch.prototype.unsubscribe = function(a) {
    this.success[a] = null,
    this.failure[a] = null,
    delete this.success[a],
    delete this.failure[a]
},
Emulator.Vehicle.Watch.prototype.fire = function(a) {
    var b = this.success;
    for (var c in b) {
        var d = b[c];
        typeof d == "function" && d.call(this, a)
    }
},
Emulator.Vehicle.SWC_WATCH = "SWC",
Emulator.Vehicle.ROTARY_WATCH = "ROTARY",
Emulator.Vehicle.RADIO_WATCH = "RADIO",
Emulator.Vehicle.PROXIMITY_WATCH = "PROXIMITY",
Emulator.Vehicle.SOFT_KEY_WATCH = "SOFT_KEYS",
Emulator.Vehicle.watches = {},
Emulator.Vehicle.watches[Emulator.Vehicle.SWC_WATCH] = new Emulator.Vehicle.Watch,
Emulator.Vehicle.watches[Emulator.Vehicle.ROTARY_WATCH] = new Emulator.Vehicle.Watch,
Emulator.Vehicle.watches[Emulator.Vehicle.RADIO_WATCH] = new Emulator.Vehicle.Watch,
Emulator.Vehicle.watches[Emulator.Vehicle.PROXIMITY_WATCH] = new Emulator.Vehicle.Watch,
Emulator.Vehicle.watches[Emulator.Vehicle.SOFT_KEY_WATCH] = new Emulator.Vehicle.Watch,
Emulator.Vehicle.proximityWatchIndex = 1e4,
Emulator.Vehicle.speedWatchIndex = 1e5,
Emulator.Vehicle.connectivityWatchIndex = 1e4,
Emulator.addVehicleDataWatch = function(a, b, c, d, e, f) {
    var g = new BaseController("body");
    Emulator.addController(g, a);
    for (var h in b) g.addObserver(Emulator.getValueRef(b[h]), "onChange", 
    function(a, b) {
        c(d, e, b, a)
    },
    f)
},
Emulator.destroyVehicleWatch = function(a) {
    Emulator.controllers[a].destroy()
},
Emulator.destroyDTCTableWatch = function(a) {
    var b = Emulator.settingsController.VehicleDataSettingController.watchHandles,
    c = b[a];
    c && (b[a] = null, delete c)
},
Emulator.watchDTCTableEntry = function(a, b, c) {
    var d = Emulator.checkArgs(arguments, [{
        name: "success",
        type: "function",
        required: !0
    },
    {
        name: "failure",
        type: "function",
        required: !1,
        "default": function() {}
    },
    {
        name: "filters",
        type: "object",
        required: !1,
        "default": {}
    }]);
    return a = d[0],
    b = d[1],
    c = d[2],
    Emulator.settingsController.VehicleDataSettingController.addWatchHandle(function() {
        try {
            var d = Emulator.getDTCTableEntry(c);
            a(d)
        } catch(e) {
            console.log(e),
            b(e)
        }
        console.log(" --> In getDTCTableEntry method")
    })
},
Emulator.getDTCTableEntry = function(a) {
    var b = Emulator.getValue(GM_CONFIG.ModelKeys.VehicleData.DTC_Table_Entry);
    console.log("*********"),
    console.log("Table List"),
    console.log(b),
    console.log("*********"),
    console.log("Filters"),
    console.log(a),
    console.log("*********");
    var c = [],
    d;
    for (var e = 0; e < b.length; e++) {
        d = b[e];
        var f = !0;
        a.failSinceCleared != null && (f = f && a.failSinceCleared == d.failSinceCleared),
        a.faultType != null && (f = f && a.faultType == d.faultType),
        a.history != null && (f = f && a.history == d.history),
        a.lastFaultDate != null && (f = f && a.lastFaultDate == d.lastFaultDate),
        a.notPassedSinceCleared != null && (f = f && a.notPassedSinceCleared == d.notPassedSinceCleared),
        a.number != null && (f = f && a.number == d.number),
        a.previousFaultDate != null && (f = f && a.previousFaultDate == d.previousFaultDate),
        a.source != null && (f = f && a.source == d.source),
        a.status != null && (f = f && a.status == d.status),
        a.tableID != null && (f = f && a.tableID == d.tableID),
        a.triggered != null && (f = f && a.triggered == d.triggered),
        a.type != null && (f = f && a.type == d.type),
        f && c.push(d)
    }
    return c
},
Emulator.getAppString = function(a) {
    return typeof a == "number" || typeof a == "string" && a.match(/^\d+$/) ? "app" + a: a
},
Emulator.getAppIDFromString = function(a) {
    return a.match(/^app/) ? a.replace(/[a-zA-Z]*/, "") * 1: a
},
Emulator.getVisibleAppID = function() {
    return iframe = x$("#applications iframe.active")[0],
    iframe != undefined ? Emulator.getAppIDFromString(iframe.id) : null
},
Emulator.getAppFrame = function(a) {
    return x$("#" + Emulator.getAppString(a))
},
Emulator.appIsLocked = function(a) {
    return Emulator.apps[a] ? Emulator.apps[a].locked: !1
},
Emulator.getAppUrl = function(a) {
    var b,
    c = Emulator.apps[a].config;
    if (typeof c.SourceLocation == "string" && c.SourceLocation.toLowerCase() == "remote") {
        var d = c.RemotePath;
        b = d + (d.charAt(d.length - 1) == "/" ? "": "/") + c.MainURL
    } else b = Emulator.apps[a].folder + c.MainURL;
    return b
},
Emulator.isAppRunning = function(a) {
    var b = x$("#applications").find("#" + Emulator.getAppString(a));
    return b.length > 0 ? !0: !1
},
Emulator.getApplicationStatus = function(a) {
    return typeof Emulator.apps[a] == "undefined" ? GM_CONFIG.APP_STATUSES.DELETED: Emulator.isAppRunning(a) ? GM_CONFIG.APP_STATUSES.ACTIVE_RUNNING: Emulator.appIsLocked(a) ? GM_CONFIG.APP_STATUSES.ACTIVE_UNAVAILABLE: GM_CONFIG.APP_STATUSES.ACTIVE_AVAILABLE
},
Emulator.generateMACAddress = function() {
    var a = "0123456789ABCDEF",
    b = 6,
    c = 2;
    macAddress = "";
    for (var d = 0; d < b; d++) {
        for (var e = 0; e < c; e++) {
            var f = Math.floor(Math.random() * a.length);
            macAddress += a.substring(f, f + 1)
        }
        macAddress += ":"
    }
    return macAddress = macAddress.substring(0, macAddress.length - 1),
    macAddress
},
Emulator.generateAuthToken = function() {
    var a = "0123456789abcdefghijklmnopqrstuvwxyz",
    b = 8,
    c = "";
    for (var d = 0; d < b; d++) {
        var e = Math.floor(Math.random() * a.length);
        c += a.substring(e, e + 1)
    }
    return c
},
Emulator.getDirName = function() {
    var a = Emulator.getRequestingApp(),
    b = Emulator.getAppFrame(a);
    if (b) {
        var c = b[0].contentWindow.location,
        d = c.href;
        return c.search != "" && (d = d.substring(0, d.indexOf(c.search))),
        d.replace(/\\/g, "/").replace(/\/[^\/]*$/, "").replace(/^.*http/, "http")
    }
    return ""
},
Emulator.getBasename = function(a) {
    return a.replace(/\\/g, "/").replace(/.*\//, "")
},
Emulator.checkTrustedApp = function() {
    var a = Emulator.getRequestingApp();
    if (a && a != "home" && Emulator.apps[a].config.TrustedApp.toLowerCase() == "false") throw new Error("Insufficient permission to use method.")
},
Emulator.checkPhoneNumber = function(a) {
    return a.match(/^\d+$/)
},
Emulator.sendToApp = function(a, b, c, d) {
    var e = GM_CONFIG.Communication.APP_WATCH_PREFIX + a;
    Emulator.PubSub.notify(e, {
        senderID: Emulator.getRequestingApp(),
        messageType: d,
        data: c,
        dataLength: b
    })
},
Emulator.callServletCommand = function(a, b, c) {
    typeof c == "undefined" && (c = "POST");
    var d = Emulator.getRequestingApp(),
    e = Emulator.apps[d].folder,
    f = new XMLHttpRequest,
    g = e + "commands/" + a + window.location.search;
    return f.open(c, g, !1),
    f.send(JSON.stringify(b)),
    f.status == 200 ? {
        success: !0,
        request: f
    }: {
        success: !1,
        error: f.responseText
    }
},
Emulator.getRequestingApp = function() {
    var a = !1;
    try {
        d.dont.exist.at.all()
    } catch(b) {
        var c = b.stack.split("\n");
        for (var d in c) for (var e in Emulator.apps) {
            var f;
            typeof Emulator.apps[e].config.SourceLocation == "string" && Emulator.apps[e].config.SourceLocation.toLowerCase() == "remote" ? f = Emulator.apps[e].config.RemotePath: f = escape(Emulator.apps[e].folder);
            var g = new RegExp(f, "g");
            if (c[d].match(g)) return a = e,
            isNaN(a) ? a: parseInt(a)
        }
    }
    return a
},
Emulator.checkArgs = function(a, b) {
    if (a.length > b.length) throw new Error("Too many arguments provided. Provide at most " + b.length + ".");
    var c = 0,
    d = [],
    e = [],
    f = [];
    for (var g in b) b[g].required ? (c++, d.push(b[g]), f.push(1)) : (e.push(b[g]), f.push(0));
    if (a.length < c) throw new Error("Did not provide all required parameters. There are " + c + ".");
    var h = [],
    i = a.length - c,
    g = 0,
    j = 0;
    while (d.length > 0 || e.length > 0) {
        var k = f[g],
        l = {};
        k ? l = d.shift() : l = e.shift();
        if (l.required) {
            var m = a[j];
            h.push(m),
            j++
        } else if (i > 0 && a[j] != null && typeof a[j] != "undefined") {
            i--;
            var m = a[j];
            h.push(m),
            j++
        } else h.push(l["default"]);
        if (typeof h[g] != l.type) throw new Error("Invalid type for argument " + l.name + ".  Provided " + typeof h[g] + ". Should be " + l.type);
        typeof h[g] == "object" && l.contents !== undefined && (h[g] = Emulator.checkObjectContents(h[g], l.contents)),
        g++;
        if (g >= b.length) break
    }
    return h
},
Emulator.checkObjectContents = function(a, b) {
    var c = {};
    for (var d in b) {
        var e = b[d];
        if (e.required && a[d] === undefined) throw new Error("Did not specify required property " + d + " with type " + e.type + ".");
        if (a[d] === undefined) c[d] = e["default"];
        else {
            if (typeof a[d] != e.type) throw new Error("Invalid type for property " + d + ".  Provided " + typeof a[d] + ". Should be " + e.type);
            c[d] = a[d]
        }
        typeof c[d] == "object" && e.contents !== undefined && (c[d] = Emulator.checkObjectContents(c[d], e.contents))
    }
    return c
},
Emulator.console = {
    log: function(a) {
        var b;
        try {
            typeof a == "function" && (a = a.toString()),
            b = Emulator.callServletCommand("console", {
                method: "log",
                data: a
            })
        } catch(c) {
            b = !1
        }
        return typeof _nativeConsole != "undefined" ? _nativeConsole.log.apply(_nativeConsole, arguments) : console.log.apply(console, arguments),
        b && b.success == 1 ? !0: !1
    }
},
Emulator.loadApp = function(a, b, c, d) {
    var e = a;
    if (typeof d != undefined && !d) {
        var f = {
            filepath: a
        };
        gm.filesystem.extractAndInstallApp(function() {
            console.log("Extraction and installation of App(" + a + ") is successfull")
        },
        function() {
            console.log("Extraction and installation of App(" + a + ") is NOT successfull"),
            c
        },
        f),
        a = e.substring(e.lastIndexOf("/") + 1, e.lastIndexOf(".")) + "/",
        console.log("Path is:" + a)
    }
    var g = new XMLHttpRequest,
    h = a + "Config.xml";
    console.log("url for the Config.xml for the new app is:" + h);
    var i = "get",
    j = {
        UNKNOWN: 0,
        INVALID_PACKAGE: 1,
        INVALID_VIN: 2,
        SECURITY_FAILURE: 3,
        API_MISMATCH: 4
    };
    g.open(i, h, !1),
    g.send("");
    if (g.status != 200) return console.log("Config.xml not found at " + h),
    typeof c == "function" && c(j.INVALID_PACKAGE),
    !1;
    try {
        var k = new DOMParser,
        l = k.parseFromString(g.responseText, "text/xml"),
        m = l.getElementsByTagName("gmWebApp")[0];
        Emulator.log(m),
        console.log("rootnode: " + m);
        var n = l.createTreeWalker(m, NodeFilter.SHOW_ALL, null, !1),
        o = {};
        while (n.nextNode()) {
            var p = n.currentNode.tagName;
            p && (o[p] = n.currentNode.textContent)
        }
        var q = parseInt(o.AppID, 10);
        return typeof Emulator.apps[q] != "undefined" && alert("Two Applications have the same AppID (" + q + "). One will be overwritten"),
        Emulator.apps[q] = new Emulator.App(q, o, a),
        Emulator.PubSub.notify(GM_CONFIG.Events.APP_INFO_CHANGE, {
            property: "ADDED",
            appID: q,
            appInfo: Emulator.apps[q].appInfo
        }),
        console.log("appID for the new App is: " + q),
        typeof b == "function" && b.call(this, {
            appID: q
        }),
        q
    } catch(r) {
        console.log(r),
        console.log("Invalid Config.xml at " + h),
        delete Emulator.apps[q],
        typeof c == "function" && c(j.INVALID_PACKAGE)
    }
},
Emulator.loadAppConfigs = function() {
    for (var a = 0; a < Emulator.APPS_LIST.apps.length; a++) Emulator.loadApp(Emulator.APPS_LIST.apps[a], 
    function() {
        console.log("app[id=" + Emulator.APPS_LIST.apps[a] + "] loaded successfully")
    },
    function() {
        console.log("app[id=" + Emulator.APPS_LIST.apps[a] + "] failed to load")
    },
    !0)
},
Emulator.App = function(a, b, c) {
    this.appID = a,
    this.config = b,
    this.locked = !1,
    this.folder = c,
    this.position = -1,
    this.appID == GM_CONFIG.SYSTEM_APP_ID && (this.config.background = !0),
    typeof this.config.TrustedApp == "undefined" && (this.config.TrustedApp = "false"),
    this.appInfo = this.parseAppInfo(a)
},
Emulator.App.prototype.remove = function() {
    return delete Emulator.apps[this.appID]
},
Emulator.App.prototype.set = function(a, b) {
    var c = this.appInfo[a];
    this.appInfo[a] = b,
    b != c && Emulator.PubSub.notify(GM_CONFIG.Events.APP_INFO_CHANGE, {
        property: a,
        appID: this.appID,
        appInfo: this.appInfo,
        newVal: b,
        oldVal: c
    })
},
Emulator.App.prototype.get = function(a) {
    return this.appInfo[a]
},
Emulator.App.prototype.parseAppInfo = function() {
    var a = this.config,
    b = this.appID;
    return {
        appID: parseInt(b),
        version: a.AppVersion,
        name: a.FriendlyName,
        requestedBy: a.RequestedBy,
        applicationType: a.AppType,
        vehicleState: a.VehicleStatus,
        iconState: a.IconDisplay,
        render: a.Render,
        status: Emulator.getApplicationStatus(b),
        updateAvailable: !1,
        lastUpdate: "",
        autoStart: a.AutoStart,
        category: a.AppCategory,
        "private": a.TrustedApp.toLowerCase() == "true" ? !0: !1,
        state: GM_CONFIG.AppStates.AS_NOT_ACTIVE
    }
},
Emulator.setDestination = function(a, b, c) {
    typeof b != "function" && (b = function() {}),
    typeof c != "function" && (c = function() {});
    if (typeof a.latitude == "undefined" || isNaN(parseFloat(a.latitude))) {
        c();
        return
    }
    if (typeof a.longitude == "undefined" || isNaN(parseFloat(a.longitude))) {
        c();
        return
    }
    var d = new Emulator.Address(a);
    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Destination, d.getDestination());
    var e = {};
    e.success = !0,
    e.errorInfo = "No Error.",
    b(e)
},
Emulator.setWaypoint = function(a, b, c) {
    typeof b != "function" && (b = function() {}),
    typeof c != "function" && (c = function() {}),
    (typeof a.latitude == "undefined" || isNaN(parseFloat(a.latitude))) && c("latitude required"),
    (typeof a.longitude == "undefined" || isNaN(parseFloat(a.longitude))) && c("longitude required");
    var d = new Emulator.Address(a);
    Emulator.setValue(GM_CONFIG.ModelKeys.Driving.Destination, d.getWaypoint()),
    b()
},
Emulator.Address = function(a) {
    a || (a = {}),
    this.latitude = parseFloat(a.latitude),
    this.longitude = parseFloat(a.longitude),
    this.address = a.address || "",
    this.state = a.state || "",
    this.city = a.city || "",
    this.street = a.street || "",
    this.house = a.house || "",
    this.zip = a.zip || "",
    this.country = a.country || "",
    this.province = a.province || "",
    this.poi = a.poi || "",
    this.phone = a.phone || "",
    this.address == "" && (this.address += this.house == "" ? "": this.house + " ", this.address += this.street == "" ? "": this.street + ", ", this.address += this.city == "" ? "": this.city + ", ", this.address += this.state == "" ? this.province == "" ? "": this.province + ", ": this.state + ", ", this.address += this.country == "" ? "": this.country + ", ", this.address += this.zip == "" ? "": this.zip + ", ")
},
Emulator.Address.prototype.init = function(a, b) {
    this.latitude != "" && this.longitude != "" || this.address == "" ? this.address == "" && this.latitude != "" && this.longitude != "" ? this.setAddressFromCoords(a, b) : b("Stored info - but insufficient address information to resolve destination") : this.setCoordsFromAddress(a, b)
},
Emulator.Address.prototype.setAddressFromCoords = function(a, b) {
    var c = new google.maps.LatLng(Emulator.arcMsToSec(this.latitude), Emulator.arcMsToSec(this.longitude));
    this.geocoder.geocode({
        latLng: c
    },
    Util.bind(this, 
    function(c) {
        if (c == null || c.length <= 0) {
            b("Could not resolve location");
            return
        }
        var d = c[0];
        for (var e in d.address_components) {
            var f = d.address_components[e];
            switch (d.address_components[e].types[0]) {
            case "street_number":
                this.house = f.long_name;
                break;
            case "route":
                this.street = f.long_name;
                break;
            case "locality":
                this.city = f.long_name;
                break;
            case "administrative_area_level_1":
                this.state = f.short_name,
                this.province = f.short_name;
                break;
            case "country":
                this.country = f.long_name;
                break;
            case "postal_code":
                this.zip = f.long_name
            }
            f = null
        }
        this.address = d.formatted_address,
        a(this.getDestination())
    }))
},
Emulator.Address.prototype.setCoordsFromAddress = function(a, b) {
    this.geocoder.geocode({
        address: this.address
    },
    Util.bind(this, 
    function(c) {
        if (c.length <= 0) {
            b("could not find address");
            return
        }
        var d = c[0].geometry.location;
        this.latitude = Emulator.secToArcMs(d.lat()),
        this.longitude = Emulator.secToArcMs(d.lng()),
        this.setAddressFromCoords(a, b)
    }))
},
Emulator.Address.prototype.getDestination = function() {
    return {
        address: this.address,
        state: this.state,
        city: this.city,
        street: this.street,
        house: this.house,
        zip: this.zip,
        country: this.country,
        province: this.province,
        poi: this.poi,
        phone: this.phone,
        latitude: this.latitude,
        longitude: this.longitude
    }
},
Emulator.Address.prototype.getWaypoint = function() {
    return {
        address: this.address,
        state: this.state,
        city: this.city,
        street: this.street,
        house: this.house,
        zip: this.zip,
        country: this.country,
        province: this.province,
        poi: this.poi,
        phone: this.phone,
        latitude: this.latitude,
        longitude: this.longitude
    }
},
Emulator.setLocation = function(a) {
    Emulator.setValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_lat.model.key, a.latitude),
    Emulator.setValue(GM_CONFIG.VehicleData.GPS_Geographical_Position_LS.gps_long.model.key, a.longitude)
},
Emulator.lookupAddress = function(a, b) {
    var c = new google.maps.Geocoder;
    c.geocode({
        address: a
    },
    function(a) {
        if (a.length <= 0) b(null);
        else {
            var c = {
                nice_address: a[0].formatted_address,
                latitude: a[0].geometry.location.lat(),
                longitude: a[0].geometry.location.lng()
            };
            b(c)
        }
    })
},
Emulator.secToArcMs = function(a) {
    return a * 36e5
},
Emulator.arcMsToSec = function(a) {
    return a / 36e5
},
Emulator.SystemResponse = function(a, b) {
    this.success = a || !1,
    this.err = b || ""
},
Emulator.log = function() {
    return
},
Emulator.init = function() {
    Emulator.loadAppConfigs(),
    Emulator.menuController = new MenuPanelController,
    Emulator.ignitionController = new IgnitionOverlayController,
    Emulator.settingsController = new SettingsOverlayController,
    Emulator.homeScreenController = new HomeScreenController,
    Emulator.swcController = new SteeringWheelPanelController,
    Emulator.navigationController = new NavigationPanelController,
    Emulator.nativeAppController = new NativeAppController,
    Emulator.timePanelController = new TimePanelController,
    Emulator.onscreenController = new OnscreenController,
    Emulator.smallScreenController = new SmallScreenPanelController,
    Emulator.debugPanelController = new DebugPanelController,
    Emulator.interactionSelectorController = new InteractionSelectorController,
    Emulator.poisearchController = new POISearchController,
    Emulator.phoneConroller = new PhoneSettingsController,
    Emulator.mediaPlayerController = new MediaPlayerController,
    Emulator.appController = new AppController
},
window.addEventListener("load", Emulator.init),
define("emulator", 
function() {}),
typeof Emulator == "undefined" && (Emulator = {}),
Emulator.API_VERSION = "2.0",
Emulator.APPS_LIST = null,
Emulator.GM_OBJECTS_INJECTED_BY_SERVER = !1,
function() {
    function getQueryString() {
        var a = window.location.search.substring(1),
        b = {},
        c = a.split("&"),
        d = 0;
        for (; d < c.length; d++) b[c[d].split("=")[0]] = c[d].split("=")[1];
        return b
    }
    var APP_CONFIG_URL = "app.config.json";
    if (window.location.search.length > 0) {
        var params = getQueryString();
        APP_CONFIG_URL = params.app_config_url || APP_CONFIG_URL,
        Emulator.API_VERSION = params.api_version || Emulator.API_VERSION
    }
    var xhr = new XMLHttpRequest;
    xhr.open("GET", APP_CONFIG_URL, !1),
    xhr.send(null),
    Emulator.APPS_LIST = eval("(" + xhr.responseText + ")"),
    typeof Emulator.APPS_LIST.GM_OBJECTS_INJECTED_BY_SERVER != "undefined" && (Emulator.GM_OBJECTS_INJECTED_BY_SERVER = !0, delete Emulator.APPS_LIST.GM_OBJECTS_INJECTED_BY_SERVER)
} (),
require(["controller/util", "controller/base-controller", "controller/ui-controller-base", "emulator.config", "view/base-view"]),
require(["lib/lawnchair/adaptors/LawnchairAdaptorHelpers", "lib/lawnchair/adaptors/DOMStorageAdaptor", "lib/lawnchair/adaptors/CookieAdaptor", "lib/lawnchair/Lawnchair", "lib/xui", "lib/pubsub/channel", "lib/pubsub/Pubsub", "lib/google-earth/geplugin-helpers", "lib/google-earth/math3d", "lib/driving-simulator", "lib/driving-simulator-timer", "model/model", "controller/ui-controller-group", "controller/settings/vehicle-configuration-controller", "controller/settings/vehicle-data-controller", "controller/settings/radio-controller", "controller/settings/network-controller", "controller/settings/bluetooth-settings-controller", "controller/settings/general-settings-controller", "controller/settings/settings-overlay-controller", "controller/menu-panel-controller", "controller/rc-panel-controller", "controller/soft-buttons-panel-controller", "controller/small-screen-panel-controller", "controller/swc-panel-controller", "controller/navigation-panel-controller", "controller/ignition-overlay-controller", "controller/home-screen-controller", "controller/time-panel-controller", "controller/onscreen-controller", "controller/native-app-controller", "controller/debug-panel-controller", "controller/interaction-selector-controller", "controller/poisearch-controller", "controller/settings/phone-controller", "controller/mediaplayer-controller", "controller/app-controller", "view/menu-panel-view", "view/settings/vehicle-configuration-view", "view/settings/vehicle-data-view", "view/settings/radio-view", "view/settings/network-view", "view/settings/bluetooth-view", "view/settings/general-settings-view", "view/rc-panel-view", "view/soft-buttons-panel-view", "view/swc-panel-view", "view/navigation-panel-view", "view/home-screen-view", "view/time-panel-view", "view/native-app-view", "view/debug-panel-view", "view/interaction-selector-view", "view/poisearch-view", "view/settings/phone-view", "gm-constants", "emulator", "js/gm." + (Emulator.API_VERSION ? Emulator.API_VERSION: "2.0") + ".js"], 
function() {
    Emulator.log("Emulator.API_VERSION:" + Emulator.API_VERSION),
    Emulator.log("scripts loaded.")
}),
define("main", 
function() {})